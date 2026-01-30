-- Migration: Add extended details columns to places table

ALTER TABLE places
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS social_media jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS price_level text, -- e.g. '$', '$$', '$$$'
ADD COLUMN IF NOT EXISTS amenities jsonb DEFAULT '[]'::jsonb, -- Using this for "Highlight and Tips" as structured data or simple list
ADD COLUMN IF NOT EXISTS what_to_expect text;

-- Comment on columns for clarity
COMMENT ON COLUMN places.social_media IS 'JSONB object for social links e.g. {"instagram": "...", "whatsapp": "..."}';
COMMENT ON COLUMN places.amenities IS 'JSONB array or object for highlights and tips';

-- Add place_id to activities to link generic places
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS place_id uuid REFERENCES places(id) ON DELETE SET NULL;

