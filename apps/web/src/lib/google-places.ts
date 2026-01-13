export interface Review {
    author_name: string;
    rating: number; // 1-5
    relative_time_description: string;
    text: string;
    profile_photo_url: string;
}

export interface PlaceDetails {
    rating: number;
    user_ratings_total: number;
    formatted_address: string;
    reviews: Review[];
    map_url?: string; // Construct this manually or from API
}

// Mock Data fallbacks
const MOCK_REVIEWS: Review[] = [
    {
        author_name: "Sarah Jenkins",
        rating: 5,
        relative_time_description: "2 weeks ago",
        text: "Absolutely breathtaking views! The sunset was magical, though it does get quite crowded. Highly recommend getting there early.",
        profile_photo_url: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random"
    },
    {
        author_name: "Michael Chen",
        rating: 4,
        relative_time_description: "a month ago",
        text: "Great experience. The ticketing system was organized, and the facilities were clean. A must-visit.",
        profile_photo_url: "https://ui-avatars.com/api/?name=Michael+Chen&background=random"
    },
    {
        author_name: "Elena Rodriguez",
        rating: 5,
        relative_time_description: "2 months ago",
        text: "One of the highlights of our trip to Indonesia. The cultural performance at night was spectacular.",
        profile_photo_url: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random"
    }
];

export async function getPlaceDetails(query: string): Promise<PlaceDetails> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // Return Mock Data if no key is provided
    if (!apiKey) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            rating: 4.8,
            user_ratings_total: 12543,
            formatted_address: `${query}, Indonesia`, // Simple fallback
            reviews: MOCK_REVIEWS
        };
    }

    try {
        // 1. Search for Place ID
        const searchRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${apiKey}`
        );
        const searchData = await searchRes.json();

        if (!searchData.candidates || searchData.candidates.length === 0) {
            throw new Error("Place not found");
        }

        const placeId = searchData.candidates[0].place_id;

        // 2. Get Details
        const detailsRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,formatted_address,reviews&key=${apiKey}`
        );
        const detailsData = await detailsRes.json();

        const result = detailsData.result;

        return {
            rating: result.rating || 0,
            user_ratings_total: result.user_ratings_total || 0,
            formatted_address: result.formatted_address || "",
            reviews: result.reviews || []
        };

    } catch (error) {
        console.error("Error fetching Google Places:", error);
        // Fallback to mock on error to prevent UI breakage
        return {
            rating: 4.8,
            user_ratings_total: 800,
            formatted_address: `${query}, Indonesia`,
            reviews: MOCK_REVIEWS
        };
    }
}
