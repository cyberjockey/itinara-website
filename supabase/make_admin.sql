-- ============================================
-- ITINARA: Promote User to Admin
-- ============================================
-- Usage: Replace 'YOUR_EMAIL_HERE' with the email of the user you want to promote.

UPDATE profiles
SET role = 'admin'
WHERE email = 'YOUR_EMAIL_HERE';

-- Verify the change
SELECT id, email, role FROM profiles WHERE role = 'admin';
