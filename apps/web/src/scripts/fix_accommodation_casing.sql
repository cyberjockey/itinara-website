-- Fix inconsistent casing for 'Accommodation' type

-- 1. Update places table
UPDATE places 
SET type = 'Accommodation' 
WHERE LOWER(type) = 'accommodation';

-- 2. Update activities table (category column)
UPDATE activities 
SET category = 'Accommodation' 
WHERE LOWER(category) = 'accommodation';

-- 3. Verify (Optional, will return 0 if successful)
SELECT count(*) as lowercase_places FROM places WHERE type = 'accommodation';
SELECT count(*) as lowercase_activities FROM activities WHERE category = 'accommodation';
