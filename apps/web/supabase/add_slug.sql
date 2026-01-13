-- Add slug column
ALTER TABLE destinations
    ADD COLUMN slug text UNIQUE;

-- Populate slug based on name (simple lowercase and hyphenated)
UPDATE destinations
SET slug = lower(replace(name, ' ', '-'));

-- Make it not null after population
ALTER TABLE destinations
    ALTER COLUMN slug SET NOT NULL;
