ALTER TABLE trip_templates 
ADD COLUMN IF NOT EXISTS estimated_budget TEXT;

COMMENT ON COLUMN trip_templates.estimated_budget IS 'Estimated budget string, e.g. "$500-1000" or "IDR 2.500k"';
