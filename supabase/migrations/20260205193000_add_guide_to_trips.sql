-- Add guide_material_url to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS guide_material_url TEXT;

-- Comment
COMMENT ON COLUMN trips.guide_material_url IS 'URL to the exclusive guide PDF/material copied from trip_templates';
