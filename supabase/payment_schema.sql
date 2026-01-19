-- Table to track processed Stripe payments
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    stripe_session_id TEXT NOT NULL UNIQUE,
    amount_total INTEGER, -- In cents
    currency TEXT,
    payment_status TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users view own transactions"
    ON payment_transactions FOR SELECT
    USING (auth.uid() = user_id);
