-- Add trip_credits to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trip_credits INTEGER DEFAULT 0;

-- Ensure payment_transactions has the correct columns
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS amount_total INTEGER;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS payment_status TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS payer_email TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS package_type TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_paypal_order_id ON payment_transactions(paypal_order_id);
