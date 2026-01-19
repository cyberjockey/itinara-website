-- Fix RLS for payment_transactions to allow inserts
-- Currently it only allows SELECT

CREATE POLICY "Users insert own transactions"
    ON payment_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Also ensure the select policy covers all cases (it likely does, but safe to verify)
-- Existing: CREATE POLICY "Users view own transactions" ON payment_transactions FOR SELECT USING (auth.uid() = user_id);
