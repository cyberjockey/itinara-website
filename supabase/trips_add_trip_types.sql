-- ============================================
-- ITINARA: Trips Table - Add Trip Type Support
-- ============================================
-- Run this to add trip type tracking to trips table

-- 1. Add trip_type column
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS trip_type TEXT DEFAULT 'premium' CHECK (trip_type IN ('premium', 'vip'));

-- 2. Update max_activities based on trip type (for existing trips)
-- Default to premium limits
UPDATE trips
SET 
    trip_type = CASE
        WHEN max_activities > 10 OR max_activities IS NULL THEN 'vip'
        ELSE 'premium'
    END,
    max_activities = CASE
        WHEN max_activities IS NULL OR max_activities > 10 THEN NULL -- VIP = unlimited
        WHEN max_activities <= 10 THEN 10 -- Premium = 10
        ELSE max_activities
    END
WHERE trip_type IS NULL;

-- 3. Function: Get trip limits based on type
CREATE OR REPLACE FUNCTION get_trip_limits(p_trip_type TEXT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_trip_type = 'premium' THEN
        RETURN json_build_object(
            'maxDays', 7,
            'maxActivities', 10
        );
    ELSIF p_trip_type = 'vip' THEN
        RETURN json_build_object(
            'maxDays', NULL,
            'maxActivities', NULL
        );
    ELSE
        RETURN json_build_object(
            'maxDays', 7,
            'maxActivities', 10
        );
    END IF;
END;
$$;

-- 4. Function: Validate trip duration
CREATE OR REPLACE FUNCTION validate_trip_duration(
    p_trip_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_trip_type TEXT;
    v_duration INTEGER;
BEGIN
    SELECT trip_type INTO v_trip_type
    FROM trips
    WHERE id = p_trip_id;
    
    v_duration := p_end_date - p_start_date + 1;
    
    -- VIP has unlimited duration
    IF v_trip_type = 'vip' THEN
        RETURN TRUE;
    END IF;
    
    -- Premium limited to 7 days
    IF v_trip_type = 'premium' AND v_duration <= 7 THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;

-- 5. Update activity count trigger to respect trip type
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

-- 6. Function: Check if activity can be added (respects trip type)
CREATE OR REPLACE FUNCTION can_add_activity(p_trip_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_count INTEGER;
    v_max_allowed INTEGER;
    v_trip_type TEXT;
BEGIN
    SELECT activity_count, max_activities, trip_type
    INTO v_current_count, v_max_allowed, v_trip_type
    FROM trips
    WHERE id = p_trip_id;
    
    -- VIP has unlimited activities
    IF v_trip_type = 'vip' THEN
        RETURN TRUE;
    END IF;
    
    -- Premium has limit
    RETURN (v_current_count < COALESCE(v_max_allowed, 10));
END;
$$;

-- 7. Index for performance
CREATE INDEX IF NOT EXISTS idx_trips_trip_type ON trips(trip_type);

-- 8. Comments
COMMENT ON COLUMN trips.trip_type IS 'Type of trip: premium (7 days, 10 activities) or vip (unlimited)';

-- ============================================
-- Migration Complete!
-- ============================================
