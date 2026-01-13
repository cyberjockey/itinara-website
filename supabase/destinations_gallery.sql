-- Add gallery images to destinations table
ALTER TABLE destinations
    ADD COLUMN gallery_images text[];

-- Note: The user will manually update this column via Supabase Dashboard or SQL as requested.
