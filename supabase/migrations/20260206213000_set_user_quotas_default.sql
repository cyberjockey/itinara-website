-- Set default premium trip quota to 3 for new users
ALTER TABLE user_quotas ALTER COLUMN premium_trips_remaining SET DEFAULT 3;
