-- ============================================
-- ITINARA: Trip Activity Limits
-- ============================================
-- Adds activity count tracking and limits to trips

-- 1. Add activity limit columns to trips table
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS activity_count INTEGER DEFAULT 0 CHECK (activity_count >= 0),
ADD COLUMN IF NOT EXISTS max_activities INTEGER DEFAULT 5 CHECK (max_activities > 0),
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;

-- 2. Comment on columns
COMMENT ON COLUMN trips.activity_count IS 'Current number of activities in this trip';
COMMENT ON COLUMN trips.max_activities IS 'Maximum activities allowed (5 for free, 10 for paid)';
COMMENT ON COLUMN trips.is_paid IS 'Whether this trip was created using a paid credit';

-- 3. Function: Update activity count automatically
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
        -- Decrement count when activity is removed
        UPDATE trips
        SET activity_count = GREATEST(activity_count - 1, 0)
        WHERE id = OLD.trip_id;
    END IF;
    
    RETURN NULL;
END;
$$;

-- 4. Trigger: Auto-update activity count
DROP TRIGGER IF EXISTS trg_update_activity_count ON activities;
CREATE TRIGGER trg_update_activity_count
    AFTER INSERT OR DELETE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_trip_activity_count();

-- 5. Function: Check if activity can be added
CREATE OR REPLACE FUNCTION can_add_activity(p_trip_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_count INTEGER;
    v_max_allowed INTEGER;
BEGIN
    SELECT activity_count, max_activities
    INTO v_current_count, v_max_allowed
    FROM trips
    WHERE id = p_trip_id;
    
    RETURN (v_current_count < v_max_allowed);
END;
$$;

-- 6. Backfill activity counts for existing trips
UPDATE trips
SET activity_count = (
    SELECT COUNT(*)
    FROM activities
    WHERE activities.trip_id = trips.id
)
WHERE activity_count = 0;

-- 7. Set max_activities based on existing trip size
-- (Assume trips with >5 activities were "paid")
UPDATE trips
SET 
    max_activities = CASE 
        WHEN activity_count > 5 THEN 10
        ELSE 5
    END,
    is_paid = CASE
        WHEN activity_count > 5 THEN TRUE
        ELSE FALSE
    END
WHERE max_activities = 5;

-- ============================================
-- Migration Complete!
-- ============================================
-- Test with: SELECT can_add_activity('trip_uuid');
