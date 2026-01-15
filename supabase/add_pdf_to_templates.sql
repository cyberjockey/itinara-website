-- Add guide_material_url to trip_templates
ALTER TABLE trip_templates
ADD COLUMN IF NOT EXISTS guide_material_url TEXT;

-- Comment
COMMENT ON COLUMN trip_templates.guide_material_url IS 'URL to the exclusive guide PDF/material (uploaded via Cloudinary)';
