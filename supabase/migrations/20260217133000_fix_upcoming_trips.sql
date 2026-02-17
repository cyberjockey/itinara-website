-- Fix for trips created with 'upcoming' status which are hidden from dashboard
-- Updates them to 'planning' so they appear in the "Current Trips" list
UPDATE public.trips 
SET status = 'planning' 
WHERE status = 'upcoming';
