-- Add guide_materials array column to trip_templates
ALTER TABLE trip_templates
ADD COLUMN IF NOT EXISTS guide_materials TEXT[] DEFAULT '{}';

-- Optional: Migrate existing single url to array
-- UPDATE trip_templates 
-- SET guide_materials = ARRAY[guide_material_url] 
-- WHERE guide_material_url IS NOT NULL AND guide_materials = '{}';
