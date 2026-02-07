
-- Drop Tables
DROP TABLE IF EXISTS guide_badges;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS ranks;

-- Remove Columns from Profiles
ALTER TABLE profiles DROP COLUMN IF EXISTS local_guide_stars;
ALTER TABLE profiles DROP COLUMN IF EXISTS google_guide_level;
