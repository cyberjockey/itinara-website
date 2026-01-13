-- Add is_public column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Create policy for public access
CREATE POLICY "Public trips are viewable by everyone"
  ON trips FOR SELECT
  USING ( is_public = true );
