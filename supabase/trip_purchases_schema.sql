-- ============================================
-- ITINARA: Trip Purchases Tracking
-- ============================================
-- Tracks all trip credit purchases via Stripe

CREATE TABLE IF NOT EXISTS trip_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Stripe references
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_session_id TEXT,
    stripe_customer_id TEXT,
    
    -- Purchase details
    package_id TEXT NOT NULL, -- 'SINGLE', 'BUNDLE_3', etc.
    trip_count INTEGER NOT NULL CHECK (trip_count > 0),
    amount_paid DECIMAL(10, 2) NOT NULL CHECK (amount_paid > 0),
    currency TEXT DEFAULT 'USD',
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Metadata (flexible JSON for future needs)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ -- Optional: credits expire after X months
);

-- Enable RLS
ALTER TABLE trip_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own purchases"
    ON trip_purchases FOR SELECT
    USING (auth.uid() = user_id);

-- Service role has full access (for webhooks)
CREATE POLICY "Service role has full access on purchases"
    ON trip_purchases FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trip_purchases_user_id ON trip_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_purchases_status ON trip_purchases(status);
CREATE INDEX IF NOT EXISTS idx_trip_purchases_stripe_payment_intent ON trip_purchases(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_trip_purchases_created ON trip_purchases(purchased_at DESC);

-- Function: Record successful purchase and add credits
CREATE OR REPLACE FUNCTION process_successful_purchase(
    p_user_id UUID,
    p_package_id TEXT,
    p_trip_count INTEGER,
    p_amount_paid DECIMAL,
    p_stripe_payment_intent_id TEXT,
    p_stripe_session_id TEXT,
    p_stripe_customer_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_purchase_id UUID;
BEGIN
    -- 1. Create purchase record
    INSERT INTO trip_purchases (
        user_id,
        package_id,
        trip_count,
        amount_paid,
        stripe_payment_intent_id,
        stripe_session_id,
        stripe_customer_id,
        status,
        completed_at
    ) VALUES (
        p_user_id,
        p_package_id,
        p_trip_count,
        p_amount_paid,
        p_stripe_payment_intent_id,
        p_stripe_session_id,
        p_stripe_customer_id,
        'completed',
        NOW()
    )
    RETURNING id INTO v_purchase_id;
    
    -- 2. Add credits to user quota
    PERFORM add_trip_credits(p_user_id, p_trip_count);
    
    RETURN v_purchase_id;
END;
$$;

-- View: Purchase history with user details (for admin)
CREATE OR REPLACE VIEW purchase_history AS
SELECT 
    tp.id,
    tp.user_id,
    u.email as user_email,
    tp.package_id,
    tp.trip_count,
    tp.amount_paid,
    tp.status,
    tp.purchased_at,
    tp.completed_at
FROM trip_purchases tp
JOIN auth.users u ON u.id = tp.user_id
ORDER BY tp.purchased_at DESC;

-- ============================================
-- Migration Complete!
-- ============================================
