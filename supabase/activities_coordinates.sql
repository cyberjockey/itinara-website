-- Add coordinates column to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS coordinates jsonb;

-- Example structure for coordinates: { "lat": -8.409, "lng": 115.188 }
