-- Add trip_preference to trip_templates table
ALTER TABLE trip_templates
ADD COLUMN IF NOT EXISTS trip_preference TEXT;

-- Comment
COMMENT ON COLUMN trip_templates.trip_preference IS 'Preference category for the trip (e.g., Adventure, Relax, Culture)';
