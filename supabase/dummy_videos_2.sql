-- Raja Ampat
UPDATE destinations
SET video_url = 'https://www.youtube.com/embed/_G3r3G_i8kU'
WHERE name ILIKE '%Raja Ampat%' OR location ILIKE '%Papua%';

-- Jakarta
UPDATE destinations
SET video_url = 'https://www.youtube.com/embed/S2pEaRj5dEM'
WHERE name ILIKE '%Jakarta%' OR location ILIKE '%Jakarta%';

-- Yogyakarta / Borobudur
UPDATE destinations
SET video_url = 'https://www.youtube.com/embed/5T2Y1k3g8h8'
WHERE name ILIKE '%Yogyakarta%' OR name ILIKE '%Borobudur%';
