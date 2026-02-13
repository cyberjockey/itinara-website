-- CNY Campaign Schema
-- Supports Coupons, Campaigns, and Guide Applications

-- 1. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    assets JSONB DEFAULT '[]'::jsonb, -- Store campaign assets (banners, text, etc)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL, -- e.g. 30 for 30%, 10 for $10
    max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb, -- Store specific plan restrictions here
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_coupons_code ON coupons(code);

-- 3. Coupon Redemptions (Track usage per user)
CREATE TABLE IF NOT EXISTS coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES coupons(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    transaction_id UUID, -- Link to payment_transactions if applicable
    redeemed_at TIMESTAMPTZ DEFAULT now(),
    
    -- Prevent double redemption for one-time global coupons if needed, 
    -- usually we want 1 per transaction, but maybe 1 per user for specific coupons?
    -- For now, we'll enforce unique per transaction via logic or index if needed.
    UNIQUE(coupon_id, user_id, transaction_id) 
);

-- 4. Guide Applications
CREATE TABLE IF NOT EXISTS guide_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    portfolio_url TEXT,
    experience_notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Update Payment Transactions
-- Add columns to track coupon usage
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_transactions' AND column_name = 'coupon_id') THEN
        ALTER TABLE payment_transactions ADD COLUMN coupon_id UUID REFERENCES coupons(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_transactions' AND column_name = 'discount_amount') THEN
        ALTER TABLE payment_transactions ADD COLUMN discount_amount NUMERIC DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_transactions' AND column_name = 'final_amount') THEN
        ALTER TABLE payment_transactions ADD COLUMN final_amount NUMERIC; -- The amount actually paid after discount
    END IF;
END $$;


-- RLS Policies

-- Campaigns: Public Read, Admin Write
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read campaigns" ON campaigns FOR SELECT USING (true);
-- Admin policies omitted for brevity, assuming admin role check or service role execution for writes

-- Coupons: Public Read (Lookup by code), Admin Write
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);

-- Coupon Redemptions: User Read Own, Admin Read All
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own redemptions" ON coupon_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own redemptions" ON coupon_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guide Applications: User Create/Read Own, Admin Read/Write All
ALTER TABLE guide_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own applications" ON guide_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users apply" ON guide_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Admin policies would be added here

-- Function to increment coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_code TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE coupons 
    SET used_count = used_count + 1 
    WHERE code = coupon_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
