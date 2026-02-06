-- Add source_template_id to trips table to track origin
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS source_template_id UUID REFERENCES trip_templates(id) ON DELETE SET NULL;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_trips_source_template_id ON trips(source_template_id);

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_template_use_count(template_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE trip_templates
  SET use_count = COALESCE(use_count, 0) + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;
