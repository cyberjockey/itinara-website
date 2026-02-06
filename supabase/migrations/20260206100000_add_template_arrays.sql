ALTER TABLE trip_templates ADD COLUMN IF NOT EXISTS featured_images text[] DEFAULT '{}';
ALTER TABLE trip_templates ADD COLUMN IF NOT EXISTS guide_materials text[] DEFAULT '{}';
