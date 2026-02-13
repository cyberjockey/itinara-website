-- Create coupons table
DROP TABLE IF EXISTS public.coupons;
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read valid coupons" ON public.coupons
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Seed CNY30 coupon
INSERT INTO public.coupons (code, discount_type, discount_value, max_uses, expires_at, is_active)
VALUES (
    'CNY30',
    'percentage',
    30,
    NULL, -- Unlimited uses (or set a high number)
    '2026-02-15 23:59:59+00',
    true
)
ON CONFLICT (code) DO UPDATE SET
    discount_value = EXCLUDED.discount_value,
    expires_at = EXCLUDED.expires_at,
    is_active = EXCLUDED.is_active;

-- Grant permissions (Fix schema cache visibility)
GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT ALL ON public.coupons TO service_role;
