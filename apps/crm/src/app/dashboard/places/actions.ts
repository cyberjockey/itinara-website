"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";
import { deleteImages } from "@/lib/cloudinary";
import { requirePermission, Permission } from "@/lib/rbac";

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
    social_media?: unknown;
    price_level?: string;
    amenities?: unknown;
    what_to_expect?: string;
    highlight_and_tips?: unknown; // JSONB
    created_at?: string;
    updated_at?: string;
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
    } catch (_e) {
        console.error("Geocoding failed:", _e);
    }

    return null;
}

export async function generatePlaceDescription(placeName: string, location: string, type: string) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("GROQ_API_KEY is missing in environment variables.");
        return "Please configure GROQ_API_KEY to use AI generation.";
    }

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

export async function getPlaces(
    destinationId?: string,
    page = 1,
    limit = 3,
    query?: string,
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc',
    filterType?: string,
    filterStatus?: string
) {
    const supabase = await createClient();

    let dbQuery = supabase.from('places').select('*', { count: 'exact' });

    // Sorting
    dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    // Filtering
    if (destinationId) {
        dbQuery = dbQuery.eq('destination_id', destinationId);
    }

    if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    if (filterType && filterType !== 'all') {
        dbQuery = dbQuery.eq('type', filterType);
    }

    if (filterStatus && filterStatus !== 'all') {
        dbQuery = dbQuery.eq('status', filterStatus);
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
    // RBAC: Guides and admins can create places
    await requirePermission(Permission.MANAGE_PLACES);

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
    const highlight_and_tips = formData.get('highlight_and_tips') ? JSON.parse(formData.get('highlight_and_tips') as string) : [];

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
            console.error("Invalid JSON images", e);
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
            what_to_expect,
            highlight_and_tips,
            google_place_name: formData.get('google_place_name') as string,
            full_address: formData.get('full_address') as string,
            rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined,
            reviewer_count: formData.get('reviewer_count') ? parseInt(formData.get('reviewer_count') as string) : undefined,
            google_maps_url: formData.get('google_maps_url') as string,
            google_place_id: formData.get('google_place_id') as string,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating place:", error);
        return { message: "Failed to create place: " + error.message };
    }

    revalidatePath('/dashboard/templates'); // Revalidate wherever templates/places are used
    return { message: "Place created successfully", place: data };
}

export async function deletePlace(id: string) {
    // RBAC: Guides and admins can delete places
    await requirePermission(Permission.MANAGE_PLACES);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized" };
    }

    // Get place to find images to delete
    const { data: place, error: fetchError } = await supabase
        .from('places')
        .select('photos, image_url')
        .eq('id', id)
        .single();

    if (fetchError || !place) {
        return { message: "Place not found" };
    }

    // Delete images from Cloudinary
    const imagesToDelete = new Set<string>();
    if (place.image_url) imagesToDelete.add(place.image_url);
    if (place.photos && Array.isArray(place.photos)) {
        place.photos.forEach((url: string) => imagesToDelete.add(url));
    }

    if (imagesToDelete.size > 0) {
        await deleteImages(Array.from(imagesToDelete));
    }

    // Delete from DB
    const { error } = await supabase
        .from('places')
        .delete()
        .eq('id', id);

    if (error) {
        return { message: "Failed to delete place: " + error.message };
    }

    revalidatePath('/dashboard/places');
    return { message: "Place deleted successfully", success: true };
}

export async function updatePlace(placeId: string, prevState: unknown, formData: FormData) {
    // RBAC: Guides and admins can update places
    await requirePermission(Permission.MANAGE_PLACES);

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

    // Fetch existing place to compare images
    const { data: existingPlace } = await supabase
        .from('places')
        .select('photos, image_url')
        .eq('id', placeId)
        .single();

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
        amenities: formData.get('amenities') ? JSON.parse(formData.get('amenities') as string) : [],
        highlight_and_tips: formData.get('highlight_and_tips') ? JSON.parse(formData.get('highlight_and_tips') as string) : [],
        google_place_name: formData.get('google_place_name') as string,
        full_address: formData.get('full_address') as string,
        rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined,
        reviewer_count: formData.get('reviewer_count') ? parseInt(formData.get('reviewer_count') as string) : undefined,
        google_maps_url: formData.get('google_maps_url') as string,
        google_place_id: formData.get('google_place_id') as string,
    };

    if (formData.get('lat') && formData.get('lng')) {
        updates.coordinates = {
            lat: parseFloat(formData.get('lat') as string),
            lng: parseFloat(formData.get('lng') as string)
        };
    }

    if (formData.has('cloudinary_images_json')) {
        try {
            const newImages = JSON.parse(formData.get('cloudinary_images_json') as string) as string[];
            updates.cloudinary_images = newImages;
            updates.photos = newImages;
            if (newImages.length > 0) {
                updates.image_url = newImages[0];
            } else {
                updates.image_url = null;
            }

            // Detect and delete removed images
            if (existingPlace && existingPlace.photos) {
                const oldImages = new Set<string>(Array.isArray(existingPlace.photos) ? existingPlace.photos : []);
                const currentImages = new Set<string>(newImages);
                const removedImages: string[] = [];

                oldImages.forEach(url => {
                    if (!currentImages.has(url)) {
                        removedImages.push(url);
                    }
                });

                if (removedImages.length > 0) {
                    // Fire and forget deletion to not block response
                    deleteImages(removedImages).catch(e => console.error("Background image deletion failed:", e));
                }
            }
        } catch (e) {
            console.error("Invalid JSON images", e);
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
    // RBAC: Only admins can do bulk operations
    await requirePermission(Permission.MANAGE_ALL_PLACES);

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
                    console.warn(`Attempt ${attempts + 1} failed for ${place.name}`, e);
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
    // RBAC: Only admins can do bulk operations
    await requirePermission(Permission.MANAGE_ALL_PLACES);

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
    // Required
    destination_name?: string;
    'city / region'?: string; // Alternative header
    name?: string;
    'place name'?: string; // Alternative header

    // Basic fields
    type?: string;
    category?: string; // Alternative header
    rating?: string;
    status?: string;
    location?: string;
    address?: string; // Alternative header
    description?: string;
    about?: string; // Alternative header
    image_url?: string;

    // Contact
    phone?: string;
    'phone / whatsapp'?: string; // Alternative header
    website?: string;
    social_media?: string;
    'social media'?: string; // Alternative header

    // Pricing & Tips
    price_level?: string;
    'price range'?: string; // Alternative header
    what_to_expect?: string;
    'what to expect'?: string; // Alternative header
    highlight_and_tips?: string;
    'highlight and tips'?: string; // Alternative header
    amenities?: string;

    // Coordinates
    latitude?: string;
    longitude?: string;

    // Google fields
    google_place_name?: string;
    'place name on google'?: string; // Alternative header
    full_address?: string;
    'full address'?: string; // Alternative header
    reviewer_count?: string;
    'reviewer count'?: string; // Alternative header
    google_maps_url?: string;
    'google maps url'?: string; // Alternative header
    google_place_id?: string;
    'place id'?: string; // Alternative header
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

    // RBAC: Only admins can do bulk upload
    await requirePermission(Permission.MANAGE_ALL_PLACES);

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

    // Helper to get value from row with alternative headers
    const getValue = (row: ParsedPlaceRow, ...keys: string[]): string | undefined => {
        for (const key of keys) {
            const val = (row as Record<string, string | undefined>)[key];
            if (val && val.trim()) return val.trim();
        }
        return undefined;
    };

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

        // Get name with alternative headers
        const name = getValue(row, 'name', 'place name');
        if (!name) {
            errors.push({ row: rowNum, error: "Missing required field: name (or 'Place Name')" });
            failed++;
            continue;
        }

        // Get destination with alternative headers
        const destNameRaw = getValue(row, 'destination_name', 'city / region');
        if (!destNameRaw) {
            errors.push({ row: rowNum, error: "Missing required field: destination_name (or 'City / Region')" });
            failed++;
            continue;
        }

        // Look up destination ID
        const destName = destNameRaw.toLowerCase().trim();
        let destinationId = destinationMap.get(destName);

        // Try partial match if exact match fails
        if (!destinationId) {
            for (const [dName, id] of destinationMap) {
                if (dName.includes(destName) || destName.includes(dName)) {
                    destinationId = id;
                    break;
                }
            }
        }

        if (!destinationId) {
            errors.push({ row: rowNum, error: `Destination not found: "${destNameRaw}"` });
            failed++;
            continue;
        }

        // Check if place already exists (by name and destination)
        const { data: existingPlace } = await supabase
            .from('places')
            .select('id, photos, image_url')
            .eq('destination_id', destinationId)
            .ilike('name', name)
            .maybeSingle();

        // Parse rating if provided
        let rating: number | null = null;
        if (row.rating) {
            const parsed = parseFloat(row.rating);
            if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
                rating = parsed;
            }
        }

        // Parse coordinates from latitude/longitude
        let coordinates: { lat: number; lng: number } | null = null;
        const latStr = getValue(row, 'latitude');
        const lngStr = getValue(row, 'longitude');
        if (latStr && lngStr) {
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng)) {
                coordinates = { lat, lng };
            }
        }

        // Parse reviewer count
        let reviewerCount: number | null = null;
        const reviewerCountStr = getValue(row, 'reviewer_count', 'reviewer count');
        if (reviewerCountStr) {
            const parsed = parseInt(reviewerCountStr.replace(/,/g, ''), 10);
            if (!isNaN(parsed)) {
                reviewerCount = parsed;
            }
        }

        // Parse social_media as JSON if it looks like JSON, otherwise store as simple object
        // Parse social_media
        let socialMedia: Record<string, string> | null = null;
        const socialMediaStr = getValue(row, 'social_media', 'social media');
        if (socialMediaStr) {
            try {
                // If it looks like JSON, parse it. Otherwise treat as single URL
                if (socialMediaStr.trim().startsWith('{') || socialMediaStr.trim().startsWith('[')) {
                    socialMedia = JSON.parse(socialMediaStr);
                } else {
                    socialMedia = { url: socialMediaStr };
                }
            } catch {
                socialMedia = { url: socialMediaStr };
            }
        }

        // Parse highlight_and_tips (JSON Array)
        let highlightAndTips: unknown = null;
        const highlightStr = getValue(row, 'highlight_and_tips', 'highlight and tips');
        if (highlightStr) {
            try {
                if (highlightStr.trim().startsWith('[')) {
                    highlightAndTips = JSON.parse(highlightStr);
                } else {
                    // split by newline or comma if not JSON? Or just wrap in array
                    highlightAndTips = [highlightStr];
                }
            } catch {
                highlightAndTips = [highlightStr];
            }
        }

        // Parse amenities (JSON Array)
        let amenities: unknown = null;
        const amenitiesStr = getValue(row, 'amenities');
        if (amenitiesStr) {
            try {
                if (amenitiesStr.trim().startsWith('[')) {
                    amenities = JSON.parse(amenitiesStr);
                } else {
                    amenities = [amenitiesStr];
                }
            } catch {
                amenities = [amenitiesStr];
            }
        }

        // Handle Images
        let newPhotos: string[] = [];
        let mainImage: string | null = null;
        if (row.image_url && row.image_url.trim()) {
            newPhotos = row.image_url.split(',').map(url => url.trim()).filter(url => url.length > 0);
        }

        if (existingPlace) {
            // UPSERT LOGIC
            const currentPhotos = new Set(existingPlace.photos || []);
            newPhotos.forEach(p => currentPhotos.add(p));
            const updatedPhotos = Array.from(currentPhotos);

            const updatedMainImage = existingPlace.image_url || ((updatedPhotos.length > 0) ? updatedPhotos[0] : null);

            const { error } = await supabase.from('places').update({
                rating: rating || undefined,
                status: getValue(row, 'status') || undefined,
                location: getValue(row, 'location', 'address') || undefined,
                description: getValue(row, 'description', 'about') || undefined,
                image_url: updatedMainImage,
                photos: updatedPhotos,
                phone: getValue(row, 'phone', 'phone / whatsapp') || undefined,
                website: getValue(row, 'website') || undefined,
                social_media: socialMedia || undefined,
                price_level: getValue(row, 'price_level', 'price range') || undefined,
                what_to_expect: getValue(row, 'what_to_expect', 'what to expect') || undefined,
                highlight_and_tips: highlightAndTips || undefined,
                amenities: amenities || undefined,
                google_place_name: getValue(row, 'google_place_name', 'place name on google') || undefined,
                full_address: getValue(row, 'full_address', 'full address') || undefined,
                reviewer_count: reviewerCount || undefined,
                google_maps_url: getValue(row, 'google_maps_url', 'google maps url') || undefined,
                google_place_id: getValue(row, 'google_place_id', 'place id') || undefined,
            }).eq('id', existingPlace.id);

            if (error) {
                errors.push({ row: rowNum, error: "Update failed: " + error.message });
                failed++;
            } else {
                inserted++;
            }
        } else {
            // INSERT LOGIC
            if (newPhotos.length > 0) {
                mainImage = newPhotos[0];
            }

            const { error } = await supabase.from('places').insert({
                destination_id: destinationId,
                name,
                type: getValue(row, 'type', 'category') || null,
                rating,
                status: getValue(row, 'status') || 'Open',
                location: getValue(row, 'location', 'address') || null,
                description: getValue(row, 'description', 'about') || null,
                image_url: mainImage,
                photos: newPhotos,
                coordinates,
                phone: getValue(row, 'phone', 'phone / whatsapp') || null,
                website: getValue(row, 'website') || null,
                social_media: socialMedia,
                price_level: getValue(row, 'price_level', 'price range') || null,
                what_to_expect: getValue(row, 'what_to_expect', 'what to expect') || null,
                highlight_and_tips: highlightAndTips || null,
                amenities: amenities || null,
                google_place_name: getValue(row, 'google_place_name', 'place name on google') || null,
                full_address: getValue(row, 'full_address', 'full address') || null,
                reviewer_count: reviewerCount,
                google_maps_url: getValue(row, 'google_maps_url', 'google maps url') || null,
                google_place_id: getValue(row, 'google_place_id', 'place id') || null,
            });

            if (error) {
                errors.push({ row: rowNum, error: error.message });
                failed++;
            } else {
                inserted++;
            }
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

// ============ INLINE FIELD UPDATE ============

const ALLOWED_FIELDS = [
    'name', 'type', 'location', 'description', 'phone', 'website',
    'price_level', 'rating', 'what_to_expect', 'highlight_and_tips',
    'social_media', 'google_place_name', 'full_address', 'reviewer_count',
    'google_maps_url', 'google_place_id', 'status'
];

export async function updatePlaceField(
    placeId: string,
    field: string,
    value: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    if (!ALLOWED_FIELDS.includes(field)) {
        return { success: false, error: `Field "${field}" is not editable` };
    }

    // Parse special fields
    let parsedValue: unknown = value;

    if (field === 'rating') {
        const num = parseFloat(value);
        parsedValue = isNaN(num) ? null : Math.min(5, Math.max(0, num));
    } else if (field === 'reviewer_count') {
        const num = parseInt(value.replace(/,/g, ''), 10);
        parsedValue = isNaN(num) ? null : num;
    } else if (field === 'social_media') {
        try {
            if (value.startsWith('{')) {
                parsedValue = JSON.parse(value);
            } else if (value) {
                parsedValue = { url: value };
            } else {
                parsedValue = null;
            }
        } catch {
            parsedValue = { url: value };
        }
    } else if (value === '') {
        parsedValue = null;
    }

    const { error } = await supabase
        .from('places')
        .update({ [field]: parsedValue })
        .eq('id', placeId);

    if (error) {
        console.error('Update failed:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/places');
    return { success: true };
}

// ============ EXPORT PLACES ============

export async function getAllPlacesForExport(
    columns: string[],
    ids?: string[]
): Promise<{ data: Record<string, unknown>[]; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { data: [], error: "Unauthorized" };
    }

    let query = supabase.from('places').select('*').order('name');

    if (ids && ids.length > 0) {
        query = query.in('id', ids);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Export query failed:', error);
        return { data: [], error: error.message };
    }

    // Filter to only requested columns and format data
    const formattedData = (data || []).map(place => {
        const row: Record<string, unknown> = {};

        for (const col of columns) {
            if (col === 'coordinates' && place.coordinates) {
                row['latitude'] = place.coordinates.lat;
                row['longitude'] = place.coordinates.lng;
            } else if (col === 'social_media' && place.social_media) {
                row[col] = typeof place.social_media === 'object'
                    ? JSON.stringify(place.social_media)
                    : place.social_media;
            } else {
                row[col] = place[col] ?? '';
            }
        }

        return row;
    });

    return { data: formattedData };
}
