-- ============================================
-- Admin Profile Management Policy
-- ============================================

-- Allow Admins to update any profile (e.g. for verifying guides)
CREATE POLICY "Admins update all profiles"
    ON profiles FOR UPDATE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Allow Admins to view all profiles (if not already public, but profiles are usually public)
-- However, "Public profiles are viewable by everyone" covers SELECT.

-- Grant usage if needed (usually automatic for table owner, but good to be explicit for app transparency)
