"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";

export type Place = {
    id: string;
    destination_id: string;
    name: string;
    type: string;
    description?: string;
    location?: string;
    image_url?: string;
    coordinates?: { lat: number; lng: number };
    phone?: string;
    website?: string;
    social_media?: any;
    price_level?: string;
    amenities?: any;
    what_to_expect?: string;
}

export async function generateCoordinates(placeName: string, location: string) {
    // Mimic AI by using a geocoding service (Nominatim)
    // This is free and requires no API key for low volume
    const query = `${placeName}, ${location}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Itinara/1.0' } });
        const data = await res.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
    } catch (e) {
        console.error("Geocoding failed:", e);
    }

    return null;
}

export async function generatePlaceDescription(placeName: string, location: string, type: string) {
    console.log("generatePlaceDescription called for:", placeName);
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("GROQ_API_KEY is missing in environment variables.");
        return "Please configure GROQ_API_KEY to use AI generation.";
    }
    console.log("GROQ_API_KEY found (length):", apiKey.length);

    try {
        const groq = new Groq({ apiKey });
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Write a short, engaging description for a travel place named "${placeName}" located in "${location}". 
                    The place type is "${type}". 
                    The description should be 2-3 sentences long, highlighting what makes it special for a traveler. 
                    Do not use markdown or quotes.`
                }
            ],
            model: "llama-3.3-70b-versatile",
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq AI description generation failed:", error);
        return null;
    }
}

export async function getPlaces(destinationId?: string, page = 1, limit = 3, query?: string) {
    const supabase = await createClient();

    let dbQuery = supabase.from('places').select('*', { count: 'exact' }).order('name');

    if (destinationId) {
        dbQuery = dbQuery.eq('destination_id', destinationId);
    }

    if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    dbQuery = dbQuery.range(start, end);

    const { data: places, count, error } = await dbQuery;

    if (error) {
        console.error("Error fetching places:", error);
        return { data: [], count: 0 };
    }

    return { data: places as Place[], count: count || 0 };
}

export async function getPlace(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return null;
    }

    return data as Place;
}

export async function createPlace(prevState: unknown, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized" };
    }

    const name = formData.get('name') as string;
    const destination_id = formData.get('destination_id') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const phone = formData.get('phone') as string;
    const website = formData.get('website') as string;
    const price_level = formData.get('price_level') as string;
    const what_to_expect = formData.get('what_to_expect') as string;
    const social_media = formData.get('social_media') ? JSON.parse(formData.get('social_media') as string) : {};
    const amenities = formData.get('amenities') ? JSON.parse(formData.get('amenities') as string) : [];

    let coordinates: { lat: number, lng: number } | null = null;
    if (formData.get('lat') && formData.get('lng')) {
        coordinates = {
            lat: parseFloat(formData.get('lat') as string),
            lng: parseFloat(formData.get('lng') as string)
        };
    }

    let cloudinary_images: string[] = [];
    if (formData.has('cloudinary_images_json')) {
        try {
            cloudinary_images = JSON.parse(formData.get('cloudinary_images_json') as string);
        } catch (e) {
            console.error("Invalid JSON images");
        }
    }

    const { data, error } = await supabase
        .from('places')
        .insert({
            name,
            destination_id,
            type,
            location,
            description,
            status: 'Open',
            coordinates,
            cloudinary_images, // Save the array of URLs
            photos: cloudinary_images, // Sync with photos array
            image_url: cloudinary_images.length > 0 ? cloudinary_images[0] : null, // Sync with image_url
            // Extended fields
            phone,
            website,
            social_media,
            price_level,
            amenities,
            what_to_expect
            // Attribution
            // guide_id: user.id // If we want to track who created it
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating place:", error);
        return { message: "Failed to create place: " + error.message };
    }

    revalidatePath('/dashboard/templates'); // Revalidate wherever templates/places are used
    revalidatePath('/dashboard/templates'); // Revalidate wherever templates/places are used
    return { message: "Place created successfully", place: data };
}

export async function updatePlace(placeId: string, prevState: unknown, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized" };
    }

    const name = formData.get('name') as string;
    const destination_id = formData.get('destination_id') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {
        name,
        destination_id,
        type,
        location,
        description,
        phone: formData.get('phone') as string,
        website: formData.get('website') as string,
        price_level: formData.get('price_level') as string,
        what_to_expect: formData.get('what_to_expect') as string,
        social_media: formData.get('social_media') ? JSON.parse(formData.get('social_media') as string) : {},
        amenities: formData.get('amenities') ? JSON.parse(formData.get('amenities') as string) : []
    };

    if (formData.get('lat') && formData.get('lng')) {
        updates.coordinates = {
            lat: parseFloat(formData.get('lat') as string),
            lng: parseFloat(formData.get('lng') as string)
        };
    }

    if (formData.has('cloudinary_images_json')) {
        try {
            const images = JSON.parse(formData.get('cloudinary_images_json') as string);
            updates.cloudinary_images = images;
            // Also update legacy columns for compatibility
            updates.photos = images;
            if (images.length > 0) {
                updates.image_url = images[0];
            }
        } catch (e) {
            console.error("Invalid JSON images");
        }
    }

    const { error } = await supabase
        .from('places')
        .update(updates)
        .eq('id', placeId);

    if (error) {
        console.error("Error updating place:", error);
        return { message: "Failed to update place: " + error.message };
    }

    revalidatePath('/dashboard/places');
    return { message: "Place updated successfully", success: true };
}

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function bulkGenerateCoordinates(placeIds: string[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized", success: false };

    let successCount = 0;
    let failCount = 0;

    for (const id of placeIds) {
        try {
            // Get current place details
            const place = await getPlace(id);
            if (!place || !place.location || (place.coordinates?.lat && place.coordinates?.lng)) {
                // Skip if no location or already has coords (optional optimization, but user might want to refresh)
                // Let's assume user wants to force refresh if they selected it, 
                // but checking if place exists is crucial.
                if (!place) failCount++;
                continue;
            }

            let coords = null;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts && !coords) {
                try {
                    coords = await generateCoordinates(place.name, place.location);
                    if (coords) break;
                } catch (e) {
                    console.warn(`Attempt ${attempts + 1} failed for ${place.name}`);
                }
                attempts++;
                if (!coords) await delay(1000 * attempts); // Exponential backoff
            }

            if (coords) {
                await supabase
                    .from('places')
                    .update({ coordinates: coords })
                    .eq('id', id);
                successCount++;
            } else {
                failCount++;
            }

            // Rate Limit Delay between items
            await delay(1000);

        } catch (e) {
            console.error(`Error processing ${id}:`, e);
            failCount++;
        }
    }

    revalidatePath('/dashboard/places');
    return {
        success: true,
        message: `Processed ${placeIds.length} items. Success: ${successCount}, Failed: ${failCount}`
    };
}

export async function bulkGenerateDescriptions(placeIds: string[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized", success: false };

    let successCount = 0;
    let failCount = 0;

    for (const id of placeIds) {
        try {
            const place = await getPlace(id);
            if (!place) {
                failCount++;
                continue;
            }

            let description = null;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts && !description) {
                attempts++;
                description = await generatePlaceDescription(place.name, place.location || "", place.type);
                if (description) break;

                if (!description) await delay(1000 * attempts);
            }

            if (description) {
                await supabase
                    .from('places')
                    .update({ description })
                    .eq('id', id);
                successCount++;
            } else {
                failCount++;
            }

            // Rate Limit Delay between items
            await delay(1500); // Slightly longer for AI generation

        } catch (e) {
            console.error(`Error processing ${id}:`, e);
            failCount++;
        }
    }

    revalidatePath('/dashboard/places');
    return {
        success: true,
        message: `Processed ${placeIds.length} items. Success: ${successCount}, Failed: ${failCount}`
    };
}

// ============ BULK CSV UPLOAD ============

export type ParsedPlaceRow = {
    destination_name: string;
    name: string;
    type?: string;
    rating?: string;
    status?: string;
    location?: string;
    description?: string;
    image_url?: string;
    phone?: string;
    website?: string;
    price_level?: string;
    what_to_expect?: string;
};

export type BulkUploadResult = {
    success: boolean;
    message: string;
    inserted: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
};

export async function getDestinations() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('destinations')
        .select('id, name')
        .order('name');

    if (error) {
        console.error("Error fetching destinations:", error);
        return [];
    }
    return data as Array<{ id: string; name: string }>;
}

export async function bulkUploadPlaces(rows: ParsedPlaceRow[]): Promise<BulkUploadResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Unauthorized", inserted: 0, failed: 0, errors: [] };
    }

    // Get all destinations for name lookup
    const destinations = await getDestinations();
    const destinationMap = new Map(
        destinations.map(d => [d.name.toLowerCase().trim(), d.id])
    );

    let inserted = 0;
    let failed = 0;
    const errors: Array<{ row: number; error: string }> = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

        // Validate required fields
        if (!row.name || !row.name.trim()) {
            errors.push({ row: rowNum, error: "Missing required field: name" });
            failed++;
            continue;
        }

        if (!row.destination_name || !row.destination_name.trim()) {
            errors.push({ row: rowNum, error: "Missing required field: destination_name" });
            failed++;
            continue;
        }

        // Look up destination ID
        const destName = row.destination_name.toLowerCase().trim();
        let destinationId = destinationMap.get(destName);

        // Try partial match if exact match fails
        if (!destinationId) {
            for (const [name, id] of destinationMap) {
                if (name.includes(destName) || destName.includes(name)) {
                    destinationId = id;
                    break;
                }
            }
        }

        if (!destinationId) {
            errors.push({ row: rowNum, error: `Destination not found: "${row.destination_name}"` });
            failed++;
            continue;
        }

        // Parse rating if provided
        let rating: number | null = null;
        if (row.rating) {
            const parsed = parseFloat(row.rating);
            if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
                rating = parsed;
            }
        }

        // Insert the place
        const { error } = await supabase.from('places').insert({
            destination_id: destinationId,
            name: row.name.trim(),
            type: row.type?.trim() || null,
            rating,
            status: row.status?.trim() || 'Open',
            location: row.location?.trim() || null,
            description: row.description?.trim() || null,
            image_url: row.image_url?.trim() || null,
            phone: row.phone?.trim() || null,
            website: row.website?.trim() || null,
            price_level: row.price_level?.trim() || null,
            what_to_expect: row.what_to_expect?.trim() || null,
        });

        if (error) {
            errors.push({ row: rowNum, error: error.message });
            failed++;
        } else {
            inserted++;
        }
    }

    revalidatePath('/dashboard/places');

    return {
        success: failed === 0,
        message: `Imported ${inserted} places. ${failed > 0 ? `${failed} failed.` : ''}`,
        inserted,
        failed,
        errors
    };
}

