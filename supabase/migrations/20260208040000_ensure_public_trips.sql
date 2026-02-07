
-- Ensure public read access to trips
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'trips'
        AND policyname = 'Public trips are viewable by everyone.'
    ) THEN
        CREATE POLICY "Public trips are viewable by everyone."
        ON trips FOR SELECT
        USING (true);
    END IF;
END
$$;

COMMIT;
