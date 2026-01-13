-- Add Google Reviews URL column
ALTER TABLE destinations
    ADD COLUMN google_reviews_url text;

-- Seed Data (Using the user provided link for Komodo/Bali)
UPDATE destinations
SET google_reviews_url = 'https://search.google.com/local/writereview?placeid=ChIJ...' -- Placeholder or real link
WHERE name ILIKE '%Komodo%';

-- Example User Link
UPDATE destinations
SET google_reviews_url = 'https://maps.app.goo.gl/VedfIpCIGZRegQY61' -- Placeholder format, user gave "https://share.google/..."
WHERE name ILIKE '%Bali%';
