-- Add 'active' status to trips table for the commit feature
-- This allows trips to be in an 'active' state when the user commits them for travel

-- Drop the existing check constraint and add a new one with 'active'
ALTER TABLE trips DROP CONSTRAINT IF EXISTS trips_status_check;
ALTER TABLE trips ADD CONSTRAINT trips_status_check CHECK (status IN ('planning', 'upcoming', 'active', 'completed'));

-- Update any existing 'upcoming' trips to stay as 'upcoming' (no change needed)
-- The 'active' status is used when user commits their trip for travel mode
