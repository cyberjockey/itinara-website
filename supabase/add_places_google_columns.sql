-- Add new columns to places table for bulk upload support
-- Run this in Supabase SQL Editor

ALTER TABLE places
ADD COLUMN IF NOT EXISTS highlight_and_tips TEXT,
ADD COLUMN IF NOT EXISTS google_place_name TEXT,
ADD COLUMN IF NOT EXISTS full_address TEXT,
ADD COLUMN IF NOT EXISTS reviewer_count INTEGER,
ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
ADD COLUMN IF NOT EXISTS google_place_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN places.highlight_and_tips IS 'Tips and highlights for the place';
COMMENT ON COLUMN places.google_place_name IS 'Place name from Google Maps';
COMMENT ON COLUMN places.full_address IS 'Complete address string from Google';
COMMENT ON COLUMN places.reviewer_count IS 'Number of Google reviews';
COMMENT ON COLUMN places.google_maps_url IS 'Google Maps URL for the place';
COMMENT ON COLUMN places.google_place_id IS 'Google Place ID for API lookups';
