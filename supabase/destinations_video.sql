-- Add video URL column to destinations table
ALTER TABLE destinations
    ADD COLUMN video_url text;

-- Seed some dummy video data (YouTube Embeds)
UPDATE destinations
SET video_url = 'https://www.youtube.com/embed/Wzwr20XW_BA?si=jE-w8y6yX0g4yX0_' -- Wonderful Indonesia: Bali
WHERE name ILIKE '%Bali%' OR location ILIKE '%Bali%';

UPDATE destinations
SET video_url = 'https://www.youtube.com/embed/h0rC2g-1y0w?si=7yX0g4yX0g4yX0g4' -- Wonderful Indonesia: Komodo (Generic filler ID for example)
WHERE name ILIKE '%Komodo%' OR location ILIKE '%Flores%';
