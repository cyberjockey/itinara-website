-- Migration to support Manual Payment Workflow (PayPal/CC)
-- 1. Alter stripe_session_id to be nullable (since manual payments won't have one initially)
ALTER TABLE payment_transactions 
ALTER COLUMN stripe_session_id DROP NOT NULL;

-- 2. Add new columns for manual workflow
ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS invoice_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'stripe'; -- 'stripe', 'paypal_manual', 'manual_cc'

-- 3. Update payment_status to be consistent (if needed)
-- Current likely values: 'paid', 'unpaid'.
-- We want to support: 'request', 'invoice_sent', 'completed', 'cancelled'
-- We won't add a hard constraint yet to avoid breaking existing data, 
-- but we will use these values in the app.

-- 4. Add index for faster queries on admin dashboard
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at DESC);

-- 5. Comment on table
COMMENT ON TABLE payment_transactions IS 'Tracks both Stripe (legacy) and Manual PayPal invoice requests.';
