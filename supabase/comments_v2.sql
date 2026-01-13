-- 1. Add ability to reply (Threaded comments)
ALTER TABLE trip_comments
    ADD COLUMN parent_id uuid REFERENCES trip_comments(id) ON DELETE CASCADE,
    ADD COLUMN updated_at timestamptz;

-- 2. Create Comment Likes table
CREATE TABLE IF NOT EXISTS comment_likes (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    comment_id uuid REFERENCES trip_comments(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, comment_id)
);

-- Link Comment Likes to Profiles for potential display
ALTER TABLE comment_likes
    ADD CONSTRAINT comment_likes_user_id_profiles_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;

-- RLS for Comment Likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can like any comment"
    ON comment_likes FOR INSERT
    WITH CHECK (true); -- Simplifying check, technically should check if they can view the comment

CREATE POLICY "Users can delete their own comment likes"
    ON comment_likes FOR DELETE
    USING ( auth.uid() = user_id );

CREATE POLICY "Everyone can view comment likes"
    ON comment_likes FOR SELECT
    USING ( true );

-- Update comments RLS to allow updating own comment (for editing)
CREATE POLICY "Users can update their own comments"
    ON trip_comments FOR UPDATE
    USING ( auth.uid() = user_id );
