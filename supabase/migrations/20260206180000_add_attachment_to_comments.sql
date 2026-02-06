-- Add attachment_url column to trip_comments table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trip_comments' AND column_name = 'attachment_url') THEN
        ALTER TABLE trip_comments ADD COLUMN attachment_url TEXT;
    END IF;
END $$;
