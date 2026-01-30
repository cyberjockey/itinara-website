"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createActivity(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const tripId = formData.get("tripId") as string;
    const dayNumber = parseInt(formData.get("dayNumber") as string);
    const title = formData.get("title") as string;
    const startTime = formData.get("startTime") as string; // "HH:MM"
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    const notes = formData.get("notes") as string;
    const placeId = formData.get("placeId") as string; // Optional linking
    const coordinatesRaw = formData.get("coordinates") as string;

    let coordinates = null;
    if (coordinatesRaw) {
        try {
            coordinates = JSON.parse(coordinatesRaw);
        } catch (e) {
            console.error("Failed to parse coordinates", e);
        }
    }

    // Basic validation
    if (!title || !tripId || !dayNumber) {
        return { message: "Missing required fields" };
    }

    // Check Trip Activity Limits
    const { data: trip } = await supabase
        .from('trips')
        .select('trip_type, max_activities, activity_count')
        .eq('id', tripId)
        .single();

    if (trip && trip.trip_type !== 'vip' && trip.max_activities !== null) {
        if ((trip.activity_count || 0) >= trip.max_activities) {
            return {
                message: "Activity limit reached. Upgrade to VIP for unlimited activities.",
                error: "LIMIT_REACHED"
            };
        }
    }

    const { error } = await supabase
        .from("activities")
        .insert({
            trip_id: tripId,
            day_number: dayNumber,
            title,
            start_time: startTime || null,
            location: location || null,
            category: category || "sightseeing",
            notes: notes || null,
            place_id: placeId || null, // Link to generic place
            coordinates: coordinates // user_id not in table? usually RLS handles or it's implicitly linked via trip
        });

    if (error) {
        console.error("Error creating activity:", error);
        return { message: "Failed to create activity. Please try again." };
    }

    revalidatePath(`/dashboard/trips/${tripId}`);
    return { message: "success" }; // Signal success to client
}
