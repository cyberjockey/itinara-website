-- Update function to be safe for deletions
CREATE OR REPLACE FUNCTION update_trip_activity_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment count when activity is added
        UPDATE trips
        SET activity_count = activity_count + 1
        WHERE id = NEW.trip_id;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- SAFEGUARD: Only update if the trip actually exists
        -- (Prevents error during cascaded trip deletion)
        IF EXISTS (SELECT 1 FROM trips WHERE id = OLD.trip_id) THEN
            UPDATE trips
            SET activity_count = GREATEST(activity_count - 1, 0)
            WHERE id = OLD.trip_id;
        END IF;
    END IF;
    
    RETURN NULL;
END;
$$;
