-- ============================================
-- ITINARA: User Trip Quotas & Credits System
-- ============================================
-- This migration creates the quota tracking system
-- Run this in your Supabase SQL editor

-- 1. Create user_quotas table
CREATE TABLE IF NOT EXISTS user_quotas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Credit balances
    free_trips_remaining INTEGER DEFAULT 1 CHECK (free_trips_remaining >= 0),
    paid_trips_remaining INTEGER DEFAULT 0 CHECK (paid_trips_remaining >= 0),
    
    -- Statistics
    total_trips_created INTEGER DEFAULT 0,
    lifetime_trips_purchased INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can view own quota"
    ON user_quotas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quota"
    ON user_quotas FOR UPDATE
    USING (auth.uid() = user_id);

-- Service role can do anything (for backend operations)
CREATE POLICY "Service role has full access"
    ON user_quotas FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- 4. Function: Auto-create quota for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_quota()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_quotas (user_id, free_trips_remaining, paid_trips_remaining)
    VALUES (NEW.id, 1, 0) -- Start with 1 free trip
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- 5. Trigger: Create quota on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_quota ON auth.users;
CREATE TRIGGER on_auth_user_created_quota
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_quota();

-- 6. Function: Get total available credits
CREATE OR REPLACE FUNCTION get_total_credits(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total INTEGER;
BEGIN
    SELECT (free_trips_remaining + paid_trips_remaining)
    INTO v_total
    FROM user_quotas
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(v_total, 0);
END;
$$;

-- 7. Function: Add paid trip credits
CREATE OR REPLACE FUNCTION add_trip_credits(p_user_id UUID, p_credits INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE user_quotas
    SET 
        paid_trips_remaining = paid_trips_remaining + p_credits,
        lifetime_trips_purchased = lifetime_trips_purchased + p_credits,
        updated_at = NOW()
    WHERE user_id = p_user_id;
END;
$$;

-- 8. Function: Deduct free trip (prioritized first)
CREATE OR REPLACE FUNCTION deduct_free_trip(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_free_remaining INTEGER;
BEGIN
    SELECT free_trips_remaining INTO v_free_remaining
    FROM user_quotas
    WHERE user_id = p_user_id;
    
    IF v_free_remaining > 0 THEN
        UPDATE user_quotas
        SET 
            free_trips_remaining = free_trips_remaining - 1,
            total_trips_created = total_trips_created + 1,
            updated_at = NOW()
        WHERE user_id = p_user_id;
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;

-- 9. Function: Deduct paid trip
CREATE OR REPLACE FUNCTION deduct_paid_trip(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_paid_remaining INTEGER;
BEGIN
    SELECT paid_trips_remaining INTO v_paid_remaining
    FROM user_quotas
    WHERE user_id = p_user_id;
    
    IF v_paid_remaining > 0 THEN
        UPDATE user_quotas
        SET 
            paid_trips_remaining = paid_trips_remaining - 1,
            total_trips_created = total_trips_created + 1,
            updated_at = NOW()
        WHERE user_id = p_user_id;
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;

-- 10. Function: Smart trip deduction (tries free first, then paid)
CREATE OR REPLACE FUNCTION deduct_trip_credit(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deducted BOOLEAN;
    v_used_type TEXT;
BEGIN
    -- Try to deduct free trip first
    v_deducted := deduct_free_trip(p_user_id);
    
    IF v_deducted THEN
        v_used_type := 'free';
    ELSE
        -- If no free trips, try paid
        v_deducted := deduct_paid_trip(p_user_id);
        IF v_deducted THEN
            v_used_type := 'paid';
        END IF;
    END IF;
    
    RETURN json_build_object(
        'success', v_deducted,
        'creditType', v_used_type
    );
END;
$$;

-- 11. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_quotas_user_id ON user_quotas(user_id);

-- 12. Backfill quotas for existing users (if any)
INSERT INTO user_quotas (user_id, free_trips_remaining, paid_trips_remaining)
SELECT 
    id as user_id,
    1 as free_trips_remaining,
    0 as paid_trips_remaining
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- Migration Complete!
-- ============================================
-- You can now:
-- 1. Check quotas: SELECT * FROM user_quotas WHERE user_id = 'xxx';
-- 2. Add credits: SELECT add_trip_credits('user_id', 5);
-- 3. Deduct credit: SELECT deduct_trip_credit('user_id');
