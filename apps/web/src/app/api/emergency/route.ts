import { NextRequest, NextResponse } from "next/server";

interface OverpassElement {
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: {
        name?: string;
        amenity?: string;
        "addr:full"?: string;
        "addr:street"?: string;
        phone?: string;
        "contact:phone"?: string;
    } & Record<string, string>;
}

interface EmergencyPlace {
    id: number;
    name: string;
    type: "hospital" | "clinic" | "police" | "pharmacy";
    lat: number;
    lon: number;
    distance?: number;
    address?: string;
    phone?: string;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const radius = searchParams.get("radius") || "5000"; // Default 5km

    if (!lat || !lon) {
        return NextResponse.json(
            { error: "Missing required parameters: lat, lon" },
            { status: 400 }
        );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const radiusMeters = parseInt(radius);

    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
            { error: "Invalid coordinates" },
            { status: 400 }
        );
    }

    // Overpass API query for emergency services
    const query = `
        [out:json][timeout:15];
        (
            node["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});
            way["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});
            node["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude});
            way["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude});
            node["amenity"="police"](around:${radiusMeters},${latitude},${longitude});
            way["amenity"="police"](around:${radiusMeters},${latitude},${longitude});
            node["amenity"="pharmacy"](around:${radiusMeters},${latitude},${longitude});
            way["amenity"="pharmacy"](around:${radiusMeters},${latitude},${longitude});
        );
        out center body;
    `;

    try {
        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: `data=${encodeURIComponent(query)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!response.ok) {
            throw new Error(`Overpass API error: ${response.status}`);
        }

        const data = await response.json();

        // Process and categorize results
        const places: EmergencyPlace[] = data.elements
            .filter((el: OverpassElement) => el.tags?.name || el.tags?.amenity)
            .map((el: OverpassElement) => {
                // For ways, use the center coordinates
                const elLat = el.lat || el.center?.lat;
                const elLon = el.lon || el.center?.lon;

                return {
                    id: el.id,
                    name: el.tags?.name || el.tags?.amenity || "Unknown",
                    type: el.tags?.amenity as EmergencyPlace["type"],
                    lat: elLat,
                    lon: elLon,
                    distance: elLat && elLon
                        ? Math.round(calculateDistance(latitude, longitude, elLat, elLon) * 10) / 10
                        : undefined,
                    address: el.tags?.["addr:full"] || el.tags?.["addr:street"],
                    phone: el.tags?.phone || el.tags?.["contact:phone"],
                };
            })
            .filter((p: EmergencyPlace) => p.lat && p.lon)
            .sort((a: EmergencyPlace, b: EmergencyPlace) => (a.distance || 0) - (b.distance || 0));

        // Categorize
        const hospitals = places.filter(p => p.type === "hospital");
        const clinics = places.filter(p => p.type === "clinic");
        const police = places.filter(p => p.type === "police");
        const pharmacies = places.filter(p => p.type === "pharmacy");

        return NextResponse.json({
            success: true,
            location: { lat: latitude, lon: longitude, radius: radiusMeters },
            results: {
                hospitals,
                clinics,
                police,
                pharmacies,
            },
            totalCount: places.length,
        });
    } catch (error) {
        console.error("Emergency API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch emergency services", details: String(error) },
            { status: 500 }
        );
    }
}
