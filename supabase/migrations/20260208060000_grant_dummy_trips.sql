DO $$
DECLARE
    guide_id UUID;
BEGIN
    -- Find the guide by name
    SELECT id INTO guide_id FROM profiles WHERE full_name = 'Donny Kusuma' LIMIT 1;
    
    IF guide_id IS NOT NULL THEN
        -- Insert 6 dummy trips to reach 'Explorer' level (min 5)
        INSERT INTO trips (user_id, title, destination, start_date, end_date, status, is_public, created_at)
        VALUES
            (guide_id, 'Iconic Bali: Temples & Beaches', 'Bali, Indonesia', NOW(), NOW() + INTERVAL '5 days', 'completed', true, NOW() - INTERVAL '1 month'),
            (guide_id, 'Hidden Gems of Yogyakarta', 'Yogyakarta, Indonesia', NOW(), NOW() + INTERVAL '3 days', 'completed', true, NOW() - INTERVAL '2 months'),
            (guide_id, 'Komodo Dragon Expedition', 'Labuan Bajo, Indonesia', NOW(), NOW() + INTERVAL '4 days', 'completed', true, NOW() - INTERVAL '3 months'),
            (guide_id, 'Raja Ampat Diving Safari', 'Raja Ampat, Indonesia', NOW(), NOW() + INTERVAL '7 days', 'completed', true, NOW() - INTERVAL '4 months'),
            (guide_id, 'Cultural Journey through Java', 'Central Java, Indonesia', NOW(), NOW() + INTERVAL '6 days', 'completed', true, NOW() - INTERVAL '5 months'),
            (guide_id, 'Sumatra Wildlife Trek', 'Sumatra, Indonesia', NOW(), NOW() + INTERVAL '5 days', 'completed', true, NOW() - INTERVAL '6 months');
            
        RAISE NOTICE 'Awarded 6 dummy trips to %', guide_id;
    ELSE
        RAISE NOTICE 'Guide Donny Kusuma not found';
    END IF;
END $$;
