
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugRecentTrips() {
    // Fetch last 3 trips
    const { data: trips } = await supabase
        .from("trips")
        .select("id, title, created_at, source_template_id")
        .order("created_at", { ascending: false })
        .limit(3);

    if (!trips) {
        console.log("No trips found.");
        return;
    }

    for (const trip of trips) {
        console.log("------------------------------------------------Data");
        console.log(`Trip ID: ${trip.id}`);
        console.log(`Title:   ${trip.title}`);
        console.log(`Created: ${trip.created_at}`);
        console.log(`Template: ${trip.source_template_id}`);

        // Fetch first 5 activities
        const { data: activities } = await supabase
            .from("activities")
            .select("title, start_time, day_number")
            .eq("trip_id", trip.id)
            .order("day_number", { ascending: true })
            .order("start_time", { ascending: true, nullsFirst: true }) // Try to replicate UI sort?
            .limit(5);

        console.log("First 5 Activities:");
        activities?.forEach(a => {
            console.log(`  [Day ${a.day_number}] ${a.start_time ?? "--:--"} - ${a.title}`);
        });
    }
}

debugRecentTrips();
