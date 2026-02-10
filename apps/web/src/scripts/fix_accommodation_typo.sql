-- Fix 'Accomodation' (one 'm') typo to 'Accommodation'

-- 1. Update places table
UPDATE places 
SET type = 'Accommodation' 
WHERE type = 'Accomodation';

-- 2. Update activities table (category column)
UPDATE activities 
SET category = 'Accommodation' 
WHERE category = 'Accomodation';

-- 3. Verify (Optional, will return 0 if successful)
SELECT count(*) as typo_places FROM places WHERE type = 'Accomodation';
SELECT count(*) as typo_activities FROM activities WHERE category = 'Accomodation';
