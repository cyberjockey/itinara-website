"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ActivityData {
    id?: string;
    title?: string;
    time?: string | null;
    start_time?: string | null; // Added to support template data
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

interface CreateTripOptions {
    templateId: string;
    startDateStr: string;
    userId: string;
    status?: 'planning' | 'active' | 'completed';
    tripType?: 'generated' | 'curated' | 'vip';
    isPublic?: boolean;
}

/**
 * Creates a new trip from a template, handling date calculations, 
 * activity creation, place lookups, and template usage stats.
 */
export async function createTripFromTemplate(options: CreateTripOptions) {
    const {
        templateId,
        startDateStr,
        userId,
        status = 'planning',
        tripType = 'curated', // Default for free templates
        isPublic = false
    } = options;

    const supabase = await createClient();

    // 1. Fetch the template
    const { data: template, error: templateError } = await supabase
        .from('trip_templates')
        .select(`*, destinations(name)`)
        .eq('id', templateId)
        .single();

    if (templateError || !template) {
        throw new Error("Template not found");
    }

    // 2. Calculate dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (template.duration_days - 1));

    // 3. Create the Trip
    const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
            user_id: userId,
            title: template.title,
            destination: template.destinations?.name || "Unknown Destination",
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: status,
            trip_type: tripType,
            source_template_id: templateId,
            is_public: isPublic,
            guide_material_url: template.guide_material_url || null,
            guide_materials: template.guide_materials || []
        })
        .select()
        .single();

    if (tripError) {
        console.error("Error creating trip:", tripError);
        throw new Error("Failed to create trip");
    }

    // 4. Create Activities from Itinerary
    const activitiesToInsert: ActivityToInsert[] = [];
    const itinerary = template.itinerary as unknown as Itinerary;

    if (itinerary && itinerary.days) {
        // Collect all activity titles to search for places (Optimization from useTemplate)
        const allTitles = new Set<string>();
        itinerary.days.forEach((day: ItineraryDay) => {
            day.activities?.forEach((activity: ActivityData) => {
                if (activity.title) allTitles.add(activity.title);
            });
        });

        // Fetch matching places
        let placesMap = new Map<string, string>();
        if (allTitles.size > 0) {
            const { data: matchedPlaces } = await supabase
                .from('places')
                .select('id, name')
                .in('name', Array.from(allTitles));

            placesMap = new Map(matchedPlaces?.map(p => [p.name || "", p.id]) || []);
        }

        itinerary.days.forEach((day: ItineraryDay, index: number) => {
            const dayNumber = index + 1;

            if (day.activities) {
                day.activities.forEach((activity: ActivityData) => {
                    // Place Resolution Logic:
                    // 1. Explicit place_id in activity
                    // 2. ID from place_data
                    // 3. Match via title from database
                    const placeId = activity.place_id || activity.place_data?.id || (activity.title ? placesMap.get(activity.title) : null);

                    // Time Resolution Logic:
                    // Checks start_time (db standard) then time (legacy/frontend)
                    const startTime = activity.start_time || activity.time || null;

                    activitiesToInsert.push({
                        trip_id: trip.id,
                        day_number: dayNumber,
                        title: activity.title || "Untitled Activity",
                        start_time: startTime,
                        location: activity.place_data?.location || activity.place_data?.name || null,
                        category: activity.place_data?.type || 'Sightseeing',
                        notes: activity.description || "",
                        place_id: placeId || null,
                    });
                });
            }
        });
    }

    if (activitiesToInsert.length > 0) {
        const { error: activitiesError } = await supabase
            .from('activities')
            .insert(activitiesToInsert);

        if (activitiesError) {
            console.error("Error inserting activities:", activitiesError);
            // We allow partial failure here for now, as the trip exists.
        }
    }

    // 5. Increment use_count
    const { error: rpcError } = await supabase.rpc('increment_template_use_count', { template_id: templateId });
    if (rpcError) {
        console.error('Failed to increment template use count:', rpcError);
    }

    // 6. Return trip info
    return trip;
}
