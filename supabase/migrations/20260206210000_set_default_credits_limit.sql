-- Set default trip credits to 3 for new users
ALTER TABLE profiles ALTER COLUMN trip_credits SET DEFAULT 3;
