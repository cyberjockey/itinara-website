-- Allow users to comment on their own trips (private or public)
CREATE POLICY "Users can comment on their own trips"
    ON trip_comments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips 
            WHERE id = trip_id 
            AND user_id = auth.uid()
        )
    );

-- Allow users to like their own trips (private or public)
CREATE POLICY "Users can like their own trips"
    ON trip_likes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips 
            WHERE id = trip_id 
            AND user_id = auth.uid()
        )
    );
