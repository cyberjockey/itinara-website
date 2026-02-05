-- Add PayPal order ID column to payment_transactions
ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;

-- Make stripe_session_id nullable (we might not always have it)
ALTER TABLE payment_transactions 
ALTER COLUMN stripe_session_id DROP NOT NULL;

-- Create index for PayPal order lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_paypal_order_id 
ON payment_transactions(paypal_order_id);

-- Update RLS to allow admins to view and update all transactions
-- (Run after admin_payment_rls.sql if not already applied)
