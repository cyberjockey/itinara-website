-- Add new columns to places table for richer details

-- Coordinates for Map integration
-- We use a simple JSONB object for flexibility: { lat: number, lng: number }
alter table places 
add column if not exists coordinates jsonb; 

-- Photo Collection
-- Array of text URLs
alter table places 
add column if not exists photos text[];

-- Google Reviews (Stored)
-- Array of JSON objects: { author: string, rating: number, text: string, time: string, avatar_url?: string }
alter table places 
add column if not exists reviews jsonb;

-- Update existing dummy data with some values (optional, for dev)
-- Bali Uluwatu Temple Example
update places 
set 
  coordinates = '{"lat": -8.8291, "lng": 115.0837}',
  photos = ARRAY[
    '/images/hero-bg.png', 
    '/images/hero-mosaic.png'
  ],
  reviews = '[
    {"author": "Sarah Jenkins", "rating": 5, "text": "Absolutely stunning sunset views! The Kecak dance is a must-see.", "time": "2 weeks ago"},
    {"author": "David Chen", "rating": 4.5, "text": "Very crowded but worth it for the temple architecture and cliffs.", "time": "1 month ago"}
  ]'::jsonb
where name ilike '%Uluwatu%';
