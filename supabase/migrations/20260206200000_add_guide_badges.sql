-- Add badge columns to profiles for Local Guides
ALTER TABLE profiles 
ADD COLUMN local_guide_stars NUMERIC(2,1) DEFAULT 5.0,
ADD COLUMN google_guide_level INTEGER DEFAULT 5;

-- Comment on columns
COMMENT ON COLUMN profiles.local_guide_stars IS 'Star rating for the local guide (0-5)';
COMMENT ON COLUMN profiles.google_guide_level IS 'Google Local Guides level (1-10)';
