-- ============================================
-- ITINARA: User Trip Quotas (Updated for 2-Tier Model)
-- ============================================
-- Run this AFTER the original user_quotas_schema.sql
-- This adds trip type tracking

-- 1. Add trip type tracking columns
ALTER TABLE user_quotas
ADD COLUMN IF NOT EXISTS premium_trips_remaining INTEGER DEFAULT 0 CHECK (premium_trips_remaining >= 0),
ADD COLUMN IF NOT EXISTS vip_trips_remaining INTEGER DEFAULT 0 CHECK (vip_trips_remaining >= 0);

-- 2. Migrate existing data (Legacy column check)
DO $$
DECLARE
    column_exists boolean;
    query_text text;
BEGIN
    -- Check if free_trips_remaining exists
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_quotas' AND column_name = 'free_trips_remaining') INTO column_exists;
    
    query_text := 'UPDATE user_quotas SET premium_trips_remaining = ';
    
    IF column_exists THEN
        query_text := query_text || 'COALESCE(free_trips_remaining, 0) + ';
    ELSE
        query_text := query_text || '0 + ';
    END IF;
    
    -- Check if paid_trips_remaining exists
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_quotas' AND column_name = 'paid_trips_remaining') INTO column_exists;
    
    IF column_exists THEN
        query_text := query_text || 'COALESCE(paid_trips_remaining, 0)';
    ELSE
        query_text := query_text || '0';
    END IF;
    
    query_text := query_text || ', vip_trips_remaining = 0 WHERE premium_trips_remaining = 0 AND vip_trips_remaining = 0;';
    
    EXECUTE query_text;
END $$;

-- 3. We can optionally drop old columns later, but keep for backward compatibility for now
-- ALTER TABLE user_quotas DROP COLUMN IF EXISTS free_trips_remaining;
-- ALTER TABLE user_quotas DROP COLUMN IF EXISTS paid_trips_remaining;

-- 4. Update function: Add credits by trip type
CREATE OR REPLACE FUNCTION add_trip_credits_by_type(
    p_user_id UUID,
    p_trip_type TEXT, -- 'premium' or 'vip'
    p_credits INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF p_trip_type = 'premium' THEN
        UPDATE user_quotas
        SET 
            premium_trips_remaining = premium_trips_remaining + p_credits,
            lifetime_trips_purchased = lifetime_trips_purchased + p_credits,
            updated_at = NOW()
        WHERE user_id = p_user_id;
    ELSIF p_trip_type = 'vip' THEN
        UPDATE user_quotas
        SET 
            vip_trips_remaining = vip_trips_remaining + p_credits,
            lifetime_trips_purchased = lifetime_trips_purchased + p_credits,
            updated_at = NOW()
        WHERE user_id = p_user_id;
    ELSE
        RAISE EXCEPTION 'Invalid trip type: %. Must be premium or vip', p_trip_type;
    END IF;
END;
$$;

-- 5. Function: Deduct trip by type
CREATE OR REPLACE FUNCTION deduct_trip_by_type(
    p_user_id UUID,
    p_trip_type TEXT -- 'premium' or 'vip'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_remaining INTEGER;
BEGIN
    IF p_trip_type = 'premium' THEN
        SELECT premium_trips_remaining INTO v_remaining
        FROM user_quotas
        WHERE user_id = p_user_id;
        
        IF v_remaining > 0 THEN
            UPDATE user_quotas
            SET 
                premium_trips_remaining = premium_trips_remaining - 1,
                total_trips_created = total_trips_created + 1,
                updated_at = NOW()
            WHERE user_id = p_user_id;
            RETURN TRUE;
        END IF;
        
    ELSIF p_trip_type = 'vip' THEN
        SELECT vip_trips_remaining INTO v_remaining
        FROM user_quotas
        WHERE user_id = p_user_id;
        
        IF v_remaining > 0 THEN
            UPDATE user_quotas
            SET 
                vip_trips_remaining = vip_trips_remaining - 1,
                total_trips_created = total_trips_created + 1,
                updated_at = NOW()
            WHERE user_id = p_user_id;
            RETURN TRUE;
        END IF;
    END IF;
    
    RETURN FALSE;
END;
$$;

-- 6. Function: Get total credits
CREATE OR REPLACE FUNCTION get_total_credits_by_type(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_premium INTEGER;
    v_vip INTEGER;
BEGIN
    SELECT premium_trips_remaining, vip_trips_remaining
    INTO v_premium, v_vip
    FROM user_quotas
    WHERE user_id = p_user_id;
    
    RETURN json_build_object(
        'premium', COALESCE(v_premium, 0),
        'vip', COALESCE(v_vip, 0),
        'total', COALESCE(v_premium, 0) + COALESCE(v_vip, 0)
    );
END;
$$;

-- 7. Update initial quota setup to use premium
CREATE OR REPLACE FUNCTION public.handle_new_user_quota()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_quotas (
        user_id,
        free_trips_remaining,
        paid_trips_remaining,
        premium_trips_remaining,
        vip_trips_remaining
    )
    VALUES (
        NEW.id,
        1, -- Keep for backward compatibility
        0,
        1, -- 1 free premium trip
        0  -- No free VIP trips
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- 8. Comments
COMMENT ON COLUMN user_quotas.premium_trips_remaining IS 'Premium trip credits ($9, 7 days, 10 activities)';
COMMENT ON COLUMN user_quotas.vip_trips_remaining IS 'VIP trip credits ($30, unlimited days/activities)';

-- ============================================
-- Migration Complete!
-- ============================================
-- Test: SELECT get_total_credits_by_type('user_id');
-- Add credits: SELECT add_trip_credits_by_type('user_id', 'premium', 3);
-- Deduct: SELECT deduct_trip_by_type('user_id', 'vip');
