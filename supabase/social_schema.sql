-- Likes Table
CREATE TABLE IF NOT EXISTS trip_likes (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, trip_id)
);

-- Enable RLS for likes
ALTER TABLE trip_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can like any public trip"
    ON trip_likes FOR INSERT
    WITH CHECK ( EXISTS (SELECT 1 FROM trips WHERE id = trip_id AND is_public = true) );

CREATE POLICY "Users can delete their own likes"
    ON trip_likes FOR DELETE
    USING ( auth.uid() = user_id );

CREATE POLICY "Everyone can view likes"
    ON trip_likes FOR SELECT
    USING ( true );


-- Comments Table
CREATE TABLE IF NOT EXISTS trip_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
    content text NOT NULL CHECK (char_length(content) > 0),
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for comments
ALTER TABLE trip_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can comment on any public trip"
    ON trip_comments FOR INSERT
    WITH CHECK ( EXISTS (SELECT 1 FROM trips WHERE id = trip_id AND is_public = true) );

CREATE POLICY "Users can delete their own comments"
    ON trip_comments FOR DELETE
    USING ( auth.uid() = user_id );

CREATE POLICY "Everyone can view comments"
    ON trip_comments FOR SELECT
    USING ( true );
