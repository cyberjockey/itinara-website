"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTripFromTemplate } from "@/app/actions/trip";

interface ActivityData {
    id?: string;
    title?: string;
    time?: string | null;
    description?: string;
    place_id?: string;
    place_data?: {
        id?: string;
        location?: string;
        name?: string;
        type?: string;
    };
}

interface ItineraryDay {
    activities: ActivityData[];
}

interface Itinerary {
    days: ItineraryDay[];
}

interface ActivityToInsert {
    trip_id: string;
    day_number: number;
    title: string;
    start_time: string | null;
    location: string | null;
    category: string;
    notes: string;
    place_id: string | null;
}

export async function purchaseTemplate(templateId: string, startDateStr: string, refCode?: string, sessionId?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // 1. Check VIP Quota
    const { data: quota, error: quotaError } = await supabase
        .from('user_quotas')
        .select('vip_trips_remaining')
        .eq('user_id', user.id)
        .single();

    if (quotaError || !quota) {
        throw new Error("Could not verify your trip credits.");
    }

    if (quota.vip_trips_remaining < 1) {
        throw new Error("Insufficient VIP Credits. Please purchase more.");
    }



    // 4. Create the Trip (via shared action)
    let trip;
    try {
        trip = await createTripFromTemplate({
            templateId,
            startDateStr,
            userId: user.id,
            status: 'active', // Auto-commit: Trip is ready for travel immediately
            tripType: 'vip',  // Explicitly VIP since purchased with VIP quota
            isPublic: false
        });
    } catch (error) {
        console.error("Error creating trip:", error);
        // Rollback Quota
        await supabase.from('user_quotas').update({ vip_trips_remaining: quota.vip_trips_remaining }).eq('user_id', user.id);
        throw new Error("Failed to create trip. Quota has been refunded.");
    }

    // 7. Track referral purchase (if applicable)
    if (refCode && sessionId) {
        try {
            const serviceSupabase = createServiceRoleClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            await serviceSupabase.from('template_referral_events').insert({
                ref_code: refCode,
                event_type: 'purchase',
                user_id: user.id,
                session_id: sessionId,
                metadata: {
                    trip_id: trip.id,
                    template_id: templateId,
                    timestamp: new Date().toISOString(),
                }
            });
        } catch (error) {
            console.error('Failed to track referral purchase:', error);
            // Don't fail the entire purchase if tracking fails
        }
    }

    // 8. Revalidate and Redirect
    revalidatePath('/dashboard');
    return { success: true, tripId: trip.id };
}
