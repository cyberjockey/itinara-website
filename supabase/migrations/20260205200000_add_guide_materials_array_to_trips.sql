-- Add guide_materials array column to trips table to match templates
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS guide_materials TEXT[] DEFAULT '{}';

COMMENT ON COLUMN trips.guide_materials IS 'Array of URLs for guide PDF/materials copied from trip_templates';
