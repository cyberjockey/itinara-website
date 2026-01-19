-- Add trip_preference to places table
ALTER TABLE places 
ADD COLUMN IF NOT EXISTS trip_preference TEXT;

-- Comment
COMMENT ON COLUMN places.trip_preference IS 'Preference category for the place (e.g., Adventure, Relax, Culture)';
