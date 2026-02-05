-- Allow Admins to View All Transactions
CREATE POLICY "Admins view all transactions"
    ON payment_transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Allow Admins to Update Transactions
CREATE POLICY "Admins update transactions"
    ON payment_transactions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
