-- Drop unused columns from profiles table (superseded by user_quotas)
ALTER TABLE profiles DROP COLUMN IF EXISTS trip_credits;
ALTER TABLE profiles DROP COLUMN IF EXISTS vip_credits;
