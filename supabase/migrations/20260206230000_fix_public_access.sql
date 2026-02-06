-- Allow public to view published templates (essential for referral landing pages)
-- This might already exist, but using DO block to avoid errors if it does
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'trip_templates' 
        AND policyname = 'Public can view published templates'
    ) THEN
        CREATE POLICY "Public can view published templates"
            ON trip_templates FOR SELECT
            USING (status = 'published');
    END IF;
END
$$;

-- Ensure profiles are publicly readable (avatars/names)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Public can view profiles'
    ) THEN
        CREATE POLICY "Public can view profiles"
            ON profiles FOR SELECT
            USING (true);
    END IF;
END
$$;

-- Ensure destinations are publicly readable
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'destinations' 
        AND policyname = 'Public can view destinations'
    ) THEN
        CREATE POLICY "Public can view destinations"
            ON destinations FOR SELECT
            USING (true);
    END IF;
END
$$;
