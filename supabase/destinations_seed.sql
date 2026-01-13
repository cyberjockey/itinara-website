-- Add sample_itinerary column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'sample_itinerary') THEN
        ALTER TABLE destinations ADD COLUMN sample_itinerary JSONB;
    END IF;
    
    -- Add slug column if it doesn't exist (it was added in previous steps via ad-hoc SQL, but good to ensure)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'slug') THEN
        ALTER TABLE destinations ADD COLUMN slug TEXT UNIQUE;
    END IF;
END $$;

-- Clear existing destinations to focus on the 6 requested regions
TRUNCATE TABLE destinations CASCADE;

-- Insert 6 Focused Regions
INSERT INTO destinations (name, slug, description, location, image_url, rating, tags, sample_itinerary)
VALUES
(
    'West Java',
    'west-java',
    'A land of highlands, tea plantations, and cool mountain air. Experience the serenity of Ciwidey and the heritage of Bandung.',
    'West Java, Indonesia',
    '/images/destinations/west-java.png',
    4.5,
    ARRAY['Nature', 'Culture', 'Relaxation'],
    '[
        {"day": 1, "title": "Bandung Heritage Walk", "description": "Explore Jalan Braga and the colonial architecture of the Paris van Java."},
        {"day": 2, "title": "Kawah Putih Crater", "description": "Morning trip to the mystical White Crater in Ciwidey."},
        {"day": 3, "title": "Tea Plantation Glamping", "description": "Stay overnight in a luxury tent amidst rolling tea fields."}
    ]'::jsonb
),
(
    'Jakarta',
    'jakarta',
    'The bustling capital where tradition meets modernity. From the historic Old Town to glittering skyscrapers.',
    'Jakarta, Indonesia',
    '/images/destinations/jakarta.png',
    4.2,
    ARRAY['City', 'History', 'Shopping'],
    '[
        {"day": 1, "title": "Kota Tua History", "description": "Visit Fatahillah Square and the Jakarta History Museum."},
        {"day": 2, "title": "Modern Jakarta", "description": "Shopping at Grand Indonesia and sunset at SKYE Bar."},
        {"day": 3, "title": "Island Escape", "description": "Day trip to the Thousand Islands for a quick beach getaway."}
    ]'::jsonb
),
(
    'Central Java',
    'central-java',
    'The spiritual heart of Java. Home to the majestic Borobudur temple and rich Javanese traditions.',
    'Central Java, Indonesia',
    '/images/destinations/central-java.png',
    4.7,
    ARRAY['History', 'Spirituality', 'Nature'],
    '[
        {"day": 1, "title": "Borobudur Sunrise", "description": "Witness the sun rising over the world''s largest Buddhist temple."},
        {"day": 2, "title": "Dieng Plateau", "description": "Explore the misty highlands, colored lakes, and ancient craters."},
        {"day": 3, "title": "Semarang Old Town", "description": "Wander through the colonial buildings of Kota Lama Semarang."}
    ]'::jsonb
),
(
    'Yogyakarta',
    'yogyakarta',
    'The soul of Indonesia. A hub of fine arts, batik, royal heritage, and student life.',
    'Yogyakarta, Indonesia',
    '/images/destinations/yogyakarta.png',
    4.9,
    ARRAY['Culture', 'Arts', 'Food'],
    '[
        {"day": 1, "title": "Kraton & Tamansari", "description": "Visit the Sultan''s Palace and the Water Castle."},
        {"day": 2, "title": "Prambanan Sunset", "description": "Marvel at the towering Hindu temples at golden hour."},
        {"day": 3, "title": "Malioboro Street Food", "description": "Taste the famous Gudeg and experience the night market vibe."}
    ]'::jsonb
),
(
    'Bali',
    'bali',
    'The Island of the Gods. A paradise of beaches, temples, terraced rice fields, and vibrant nightlife.',
    'Bali, Indonesia',
    '/images/destinations/bali.png',
    4.8,
    ARRAY['Beaches', 'Culture', 'Nightlife'],
    '[
        {"day": 1, "title": "Uluwatu Cliff & Dance", "description": "Watch the Kecak Fire Dance with a sunset ocean backdrop."},
        {"day": 2, "title": "Ubud Art & Nature", "description": "Visit the Monkey Forest and Tegalalang Rice Terrace."},
        {"day": 3, "title": "Seminyak Beach Club", "description": "Relax in style at one of Bali''s famous beach clubs."}
    ]'::jsonb
),
(
    'Lombok & Sumbawa',
    'lombok',
    'Unspoiled beauty. Pristine beaches, the mighty Mount Rinjani, and traditional Sasak villages.',
    'West Nusa Tenggara, Indonesia',
    '/images/destinations/lombok.png',
    4.6,
    ARRAY['Adventure', 'Beaches', 'Nature'],
    '[
        {"day": 1, "title": "Mandalika Beaches", "description": "Relax on the white sands of Tanjung Aan and Kuta Lombok."},
        {"day": 2, "title": "Gili Trawangan", "description": "Snorkel with turtles and cycle around the car-free island."},
        {"day": 3, "title": "Sasak Village Tour", "description": "Experience the unique culture and weaving traditions of the Sasak people."}
    ]'::jsonb
);
