-- Add country column to destinations
ALTER TABLE destinations 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Indonesia';

-- Optional: Update existing records based on location if needed, 
-- but for now default 'Indonesia' covers most use cases.
