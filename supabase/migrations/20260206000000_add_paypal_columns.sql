-- Migration: Add PayPal-related columns to payment_transactions
-- This adds paypal_order_id for tracking PayPal orders

-- Add paypal_order_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payment_transactions' 
                   AND column_name = 'paypal_order_id') THEN
        ALTER TABLE payment_transactions ADD COLUMN paypal_order_id TEXT;
    END IF;
END $$;

-- Add payer_email column for storing PayPal payer email
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payment_transactions' 
                   AND column_name = 'payer_email') THEN
        ALTER TABLE payment_transactions ADD COLUMN payer_email TEXT;
    END IF;
END $$;

-- Add completed_at column for tracking completion time
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payment_transactions' 
                   AND column_name = 'completed_at') THEN
        ALTER TABLE payment_transactions ADD COLUMN completed_at TIMESTAMPTZ;
    END IF;
END $$;

-- Create index on paypal_order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_paypal_order_id 
ON payment_transactions(paypal_order_id) 
WHERE paypal_order_id IS NOT NULL;
