-- Add rating columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS local_guide_stars NUMERIC DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS google_guide_level INTEGER DEFAULT 5;

-- Update existing profiles to have default values (optional, but good for display)
UPDATE profiles 
SET local_guide_stars = 5.0 
WHERE local_guide_stars IS NULL;

UPDATE profiles 
SET google_guide_level = 5 
WHERE google_guide_level IS NULL;
