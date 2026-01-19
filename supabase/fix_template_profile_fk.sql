-- Fix FK to allow joining with profiles
ALTER TABLE trip_templates
    DROP CONSTRAINT IF EXISTS trip_templates_guide_id_fkey;

ALTER TABLE trip_templates
    ADD CONSTRAINT trip_templates_guide_id_fkey
    FOREIGN KEY (guide_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;
