
async function generateCoordinates(placeName: string, location: string) {
    console.log(`Geocoding: ${placeName}, ${location}`);
    const query = `${placeName}, ${location}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Itinara/1.0' } });
        const data = await res.json();

        console.log("Response data:", JSON.stringify(data, null, 2));

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

async function test() {
    console.log("Testing AI Coordinate Generation Logic...");
    const result = await generateCoordinates("Monas", "Jakarta");
    console.log("Result for Monas, Jakarta:", result);

    if (result && result.lat && result.lng) {
        console.log("SUCCESS: Coordinates generated.");
    } else {
        console.error("FAILURE: No coordinates return.");
    }
}

test();
