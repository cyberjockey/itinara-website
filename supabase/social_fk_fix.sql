-- Add FK to profiles table to allow PostgREST embedding
ALTER TABLE trip_comments
    ADD CONSTRAINT trip_comments_user_id_profiles_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

ALTER TABLE trip_likes
    ADD CONSTRAINT trip_likes_user_id_profiles_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;
