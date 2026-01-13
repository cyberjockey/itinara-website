"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createActivity(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const tripId = formData.get("tripId") as string;
    const dayNumber = parseInt(formData.get("dayNumber") as string);
    const title = formData.get("title") as string;
    const startTime = formData.get("startTime") as string; // Optional
    const location = formData.get("location") as string; // Optional
    const notes = formData.get("notes") as string; // Optional
    const category = formData.get("category") as string; // Optional

    // Basic validation
    if (!tripId || !title || !dayNumber) {
        return { message: "Missing required fields." };
    }

    const { error } = await supabase.from("activities").insert({
        trip_id: tripId,
        day_number: dayNumber,
        title,
        start_time: startTime || null,
        location: location || null,
        category: category || "other",
        notes: notes || null,
    });

    if (error) {
        console.error("Error creating activity:", error);
        return { message: "Failed to create activity. Please try again." };
    }

    revalidatePath(`/dashboard/trips/${tripId}`);
    return { message: "success" }; // Signal success to client
}
