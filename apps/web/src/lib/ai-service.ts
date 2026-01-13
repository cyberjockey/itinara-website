export interface AIItineraryGenerationParams {
    destination: string;
    days: number;
    budget: string;
    travelers: string;
    interests: string[];
}

export interface GeneratedActivity {
    title: string;
    time: string; // "09:00"
    location: string;
    description: string;
    cost_estimate?: string;
}

export interface GeneratedDay {
    day_number: number;
    theme?: string;
    activities: GeneratedActivity[];
}

export interface GeneratedItinerary {
    title: string;
    description: string;
    days: GeneratedDay[];
    cover_image_url?: string; // Optional cover
}

const MOCK_BALI_ITINERARY: GeneratedItinerary = {
    title: "Magical Bali: Culture & Coast",
    description: "A perfectly balanced 5-day journey exploring the spiritual heart of Ubud and the stunning beaches of Uluwatu.",
    cover_image_url: "/images/hero-bg.png", // Reusing existing asset
    days: [
        {
            day_number: 1,
            theme: "Arrival & Ubud's Spiritual Heart",
            activities: [
                {
                    title: "Check-in at Resort",
                    time: "14:00",
                    location: "Ubud, Bali",
                    description: "Settle into your jungle retreat and enjoy a welcome drink.",
                },
                {
                    title: "Sunset at Campuhan Ridge Walk",
                    time: "17:30",
                    location: "Campuhan Ridge Walk, Ubud",
                    description: "A scenic gentle hike with lush valley views.",
                },
                {
                    title: "Dinner at Hujan Locale",
                    time: "19:30",
                    location: "Jalan Sri Wedari, Ubud",
                    description: "Modern Indonesian cuisine in a vintage tropical setting.",
                }
            ]
        },
        {
            day_number: 2,
            theme: "Sacred Waters & Rice Terraces",
            activities: [
                {
                    title: "Tegalalang Rice Terrace",
                    time: "08:00",
                    location: "Tegalalang, Ubud",
                    description: "Explore the famous iconic rice paddies before the crowds arrive.",
                },
                {
                    title: "Tirta Empul Water Temple",
                    time: "11:00",
                    location: "Tampak Siring",
                    description: "Participate in a traditional purification ritual.",
                },
                {
                    title: "Lunch at The Sayan House",
                    time: "13:00",
                    location: "Sayan, Ubud",
                    description: "Japanese-Latin fusion with breathtaking ridge views.",
                }
            ]
        },
        {
            day_number: 3,
            theme: "Cliffs & Kecak Fire Dance",
            activities: [
                {
                    title: "Transfer to Uluwatu",
                    time: "10:00",
                    location: "Uluwatu",
                    description: "Drive south to the limestone cliffs.",
                },
                {
                    title: "Uluwatu Temple",
                    time: "16:30",
                    location: "Uluwatu Temple",
                    description: "Visit the sea temple perched on a cliff.",
                },
                {
                    title: "Kecak Fire Dance Performance",
                    time: "18:00",
                    location: "Uluwatu Temple Amphitheater",
                    description: "Watch the dramatic sunset performance.",
                }
            ]
        }
    ]
};

export async function generateItinerary(params: AIItineraryGenerationParams): Promise<GeneratedItinerary> {
    // Simulate AI Latency
    await new Promise(resolve => setTimeout(resolve, 3000));

    // In the future:
    // const prompt = `Plan a ${params.days} day trip to ${params.destination} for ${params.travelers} with budget ${params.budget}...`;
    // const result = await openAI.chat.completions.create(...)

    // For now, always return the Mock Bali Trip, maybe customised slightly if we want
    return {
        ...MOCK_BALI_ITINERARY,
        title: `Magical ${params.destination || "Bali"} Escape`,
        description: `A custom ${params.days}-day journey for ${params.travelers} tailored to ${params.interests.join(", ")}.`
    };
}
