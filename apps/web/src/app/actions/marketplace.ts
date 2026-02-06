"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

    // 2. Fetch the template
    const { data: template, error: templateError } = await supabase
        .from('trip_templates')
        .select(`*, destinations(name)`)
        .eq('id', templateId)
        .single();

    if (templateError || !template) {
        throw new Error("Template not found");
    }

    // 3. Deduct Quota
    const { error: updateError } = await supabase
        .from('user_quotas')
        .update({ vip_trips_remaining: quota.vip_trips_remaining - 1 })
        .eq('user_id', user.id);

    if (updateError) {
        throw new Error("Failed to process payment (Quota deduction).");
    }

    // 4. Create the Trip
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (template.duration_days - 1));

    const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
            user_id: user.id,
            title: template.title,
            destination: template.destinations?.name || "Unknown Destination",
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'planning',
            trip_type: 'vip', // Explicitly VIP since purchased with VIP quota
            is_public: false,
            source_template_id: templateId // Fix: Link to template so guide chat works
        })
        .select()
        .single();

    if (tripError) {
        console.error("Error creating trip:", tripError);
        // CRITICAL: We deducted quota but failed to create trip. 
        // Ideally we should rollback quota here.
        await supabase.from('user_quotas').update({ vip_trips_remaining: quota.vip_trips_remaining }).eq('user_id', user.id);
        throw new Error("Failed to create trip. Quota has been refunded.");
    }

    // 5. Create Activities
    const activitiesToInsert: any[] = [];
    const itinerary = template.itinerary as any;

    if (itinerary && itinerary.days) {
        itinerary.days.forEach((day: any, index: number) => {
            const dayNumber = index + 1;
            if (day.activities) {
                day.activities.forEach((activity: any) => {
                    // Look up Place ID if available? 
                    // Template activities usually store `place_id` in `place_data` or `place_id` prop?
                    // The `useTemplate` logic used `place_data?.location` text.
                    // If we have `place_id`, we should use it to enable the Map Fix we just did.

                    const placeId = activity.place_id || activity.place_data?.id || null;

                    activitiesToInsert.push({
                        trip_id: trip.id,
                        day_number: dayNumber,
                        title: activity.title || "Untitled Activity",
                        start_time: activity.time || null,
                        location: activity.place_data?.location || activity.place_data?.name || null,
                        category: activity.place_data?.type || 'Sightseeing',
                        notes: activity.description || "",
                        place_id: placeId // IMPORTANT for Map
                    });
                });
            }
        });
    }

    if (activitiesToInsert.length > 0) {
        await supabase.from('activities').insert(activitiesToInsert);
    }

    // 6. Increment use_count
    await supabase.rpc('increment_template_use_count', { template_id: templateId });

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
