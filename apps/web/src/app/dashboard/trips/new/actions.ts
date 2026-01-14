"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTrip(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "You must be logged in to create a trip." };
    }

    const destination = formData.get("destination") as string;
    const title = (formData.get("title") as string) || destination;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const tripType = (formData.get("trip_type") as string) || 'premium';

    // 1. Check if user has quota for this trip type
    const { data: quota } = await supabase
        .from('user_quotas')
        .select('premium_trips_remaining, vip_trips_remaining')
        .eq('user_id', user.id)
        .single();

    if (!quota) {
        return { message: "Unable to verify your trip credits. Please try again." };
    }

    const hasCredit = tripType === 'premium'
        ? quota.premium_trips_remaining > 0
        : quota.vip_trips_remaining > 0;

    if (!hasCredit) {
        return {
            message: `You don't have any ${tripType === 'premium' ? 'Premium' : 'VIP'} trip credits. Please purchase more credits to continue.`,
            error: 'NO_CREDITS'
        };
    }

    // 2. Validate trip duration for Premium trips (7 day limit)
    if (tripType === 'premium') {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (days > 7) {
            return {
                message: "Premium trips are limited to 7 days. Please upgrade to VIP for longer trips or adjust your dates.",
                error: 'DURATION_EXCEEDED'
            };
        }
    }

    // 3. Ensure profile exists
    const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            full_name: user.user_metadata?.first_name
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
                : user.email?.split('@')[0],
            email: user.email
        }, { onConflict: 'id' })
        .select()
        .single();

    if (profileError && profileError.code !== 'PGRST116') {
        console.warn("Could not ensure profile exists:", profileError);
    }

    // 4. Create trip with type and limits
    const maxActivities = tripType === 'premium' ? 10 : null; // VIP = unlimited

    const { error: tripError } = await supabase.from("trips").insert({
        user_id: user.id,
        title,
        destination,
        start_date: startDate,
        end_date: endDate,
        status: "upcoming",
        trip_type: tripType,
        max_activities: maxActivities,
        activity_count: 0,
    });

    if (tripError) {
        console.error("Error creating trip:", tripError);
        return { message: "Failed to create trip. Please try again." };
    }

    // 5. Deduct trip credit
    const { error: deductError } = await supabase.rpc('deduct_trip_by_type', {
        p_user_id: user.id,
        p_trip_type: tripType
    });

    if (deductError) {
        console.error("Error deducting credit:", deductError);
        // Trip was created but credit wasn't deducted - should log this
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

import { GeneratedItinerary } from "@/lib/ai-service";

export async function createTripFromAI(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const jsonString = formData.get("itinerary") as string;
    const itinerary: GeneratedItinerary = JSON.parse(jsonString);

    // 1. Create Trip
    const today = new Date();
    // Default to a trip starting next Monday
    const startDate = new Date(today.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7)));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + itinerary.days.length - 1);

    // Note: 'image_url' is not in the schema yet, omitting it to prevent errors.
    const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
            user_id: user.id,
            title: itinerary.title,
            destination: "Derived from AI",
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'upcoming'
        })
        .select()
        .single();

    if (tripError || !trip) {
        console.error("Trip Creation Error", tripError);
        throw new Error("Failed to create trip");
    }

    // 2. Create Activities
    for (const day of itinerary.days) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + (day.day_number - 1));
        const dateStr = dayDate.toISOString().split('T')[0];

        // activities table has: trip_id, day_number, start_time, title, location, category, notes
        const activitiesToInsert = day.activities.map(act => ({
            trip_id: trip.id,
            day_number: day.day_number,
            title: act.title,
            location: act.location,
            notes: act.description,
            start_time: act.time,
            category: 'sightseeing' // Default category
        }));

        if (activitiesToInsert.length > 0) {
            const { error: actError } = await supabase
                .from('activities')
                .insert(activitiesToInsert);

            if (actError) {
                console.error("Activity Insert Error", actError);
                // We continue inserting other days even if one fails, or we could throw.
            }
        }
    }

    revalidatePath("/dashboard");
    redirect(`/dashboard/trips/${trip.id}`);
}

export async function searchDestinations(query: string) {
    const supabase = await createClient();

    if (!query || query.length < 2) return [];

    const { data: destinations } = await supabase
        .from('destinations')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .limit(5);

    return destinations || [];
}
