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

    const title = formData.get("title") as string;
    const destination = formData.get("destination") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    // Ensure profile exists (in case trigger missed it or user pre-dated schema)
    const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            // We can try to grab metadata if available, or just leave other fields null
            full_name: user.user_metadata?.first_name
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
                : user.email?.split('@')[0],
            email: user.email
        }, { onConflict: 'id' })
        .select()
        .single();

    if (profileError && profileError.code !== 'PGRST116') {
        // Ignore "JSON object requested, multiple (or no) rows returned" if using .single() on upsert sometimes
        console.warn("Could not ensure profile exists:", profileError);
    }

    const { error } = await supabase.from("trips").insert({
        user_id: user.id,
        title,
        destination,
        start_date: startDate,
        end_date: endDate,
        status: "upcoming", // Default status
    });

    if (error) {
        console.error("Error creating trip:", error);
        return { message: "Failed to create trip. Please try again." };
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
