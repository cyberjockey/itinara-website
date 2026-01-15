-- Add trip_type to trip_templates
ALTER TABLE trip_templates
ADD COLUMN IF NOT EXISTS trip_type TEXT DEFAULT 'standard' CHECK (trip_type IN ('standard', 'vip'));

-- Comment
COMMENT ON COLUMN trip_templates.trip_type IS 'Type of trip: standard (free/premium quota) or vip (vip quota)';
