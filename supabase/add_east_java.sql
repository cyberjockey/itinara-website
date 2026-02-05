-- Insert "East Java" Destination
-- Image is expected to be at /destinations/east-java.png (relative to public)

INSERT INTO destinations (name, slug, description, location, image_url, rating, tags, sample_itinerary)
VALUES
(
    'East Java',
    'east-java',
    'The land of fire and mist. Witness the blue flames of Ijen, the sunrise over Mount Bromo, and the majestic waterfalls.',
    'East Java, Indonesia',
    '/images/destinations/east-java.png',
    4.8,
    ARRAY['Nature', 'Adventure', 'Volcanoes'],
    '[
        {"day": 1, "title": "Malang Heritage & Rainbow Village", "description": "Explore the colonial history of Malang and the colorful houses of Jodipan."},
        {"day": 2, "title": "Bromo Sunrise", "description": "Jeep ride to Penanjakan for sunrise, then hike to the Bromo crater."},
        {"day": 3, "title": "Ijen Blue Fire", "description": "Midnight hike to Ijen Crater to see the famous blue fire and turquoise lake."}
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    location = EXCLUDED.location,
    image_url = EXCLUDED.image_url,
    rating = EXCLUDED.rating,
    tags = EXCLUDED.tags,
    sample_itinerary = EXCLUDED.sample_itinerary;
