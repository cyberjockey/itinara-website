
-- Ensure public read access to profiles
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'profiles'
        AND policyname = 'Public profiles are viewable by everyone.'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone."
        ON profiles FOR SELECT
        USING (true);
    END IF;
END
$$;

COMMIT;
