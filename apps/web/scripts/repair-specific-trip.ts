
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TRIP_ID = "624099bb-3ae0-496d-b00c-f33de8e9ce47";

async function repairSpecificTrip() {
    console.log(`Repairing trip ID: ${TRIP_ID}`);

    const { data: trip } = await supabase
        .from("trips")
        .select("id, title, source_template_id")
        .eq("id", TRIP_ID)
        .single();

    if (!trip || !trip.source_template_id) {
        console.error("Trip or template not found");
        return;
    }

    const { data: template } = await supabase
        .from("trip_templates")
        .select("itinerary")
        .eq("id", trip.source_template_id)
        .single();

    const itinerary = template?.itinerary as any;
    if (!itinerary?.days) return;

    // Fetch activities sorted by ID (assuming insertion order)
    const { data: activities } = await supabase
        .from("activities")
        .select("id, title, day_number, start_time")
        .eq("trip_id", trip.id)
        .order('id', { ascending: true }); // Important for sequential matching

    if (!activities) return;

    const activitiesByDay: Record<number, any[]> = {};
    activities.forEach(a => {
        if (!activitiesByDay[a.day_number]) activitiesByDay[a.day_number] = [];
        activitiesByDay[a.day_number].push(a);
    });

    let updatedCount = 0;

    // Iterate through days
    for (let dayNum = 1; dayNum <= itinerary.days.length; dayNum++) {
        const templateDay = itinerary.days[dayNum - 1];
        const userActivities = activitiesByDay[dayNum];
        if (!templateDay || !userActivities) continue;

        const pendingTemplateActivities = [...(templateDay.activities || [])];

        for (const userActivity of userActivities) {
            const matchIndex = pendingTemplateActivities.findIndex(
                (ta: any) => ta.title === userActivity.title
            );

            if (matchIndex !== -1) {
                const matchedTemplate = pendingTemplateActivities[matchIndex];

                // Update if missing or --:-- (null)
                if (!userActivity.start_time && matchedTemplate.start_time) {
                    console.log(`[Day ${dayNum}] Fixing '${userActivity.title}' -> ${matchedTemplate.start_time}`);
                    await supabase.from("activities").update({ start_time: matchedTemplate.start_time }).eq("id", userActivity.id);
                    updatedCount++;
                }

                pendingTemplateActivities.splice(matchIndex, 1);
            }
        }
    }
    console.log(`Repaired ${updatedCount} activities.`);
}

repairSpecificTrip();
