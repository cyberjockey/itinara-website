-- Update Bali destinations
UPDATE destinations 
SET gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
]
WHERE name ILIKE '%Bali%' OR location ILIKE '%Bali%';

-- Update Komodo destinations
UPDATE destinations
SET gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80'
]
WHERE name ILIKE '%Komodo%' OR location ILIKE '%Flores%';

-- Update others generic
UPDATE destinations
SET gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
]
WHERE gallery_images IS NULL;
