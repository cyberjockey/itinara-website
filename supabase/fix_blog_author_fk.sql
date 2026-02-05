-- Link posts.author_id to profiles.id
-- This allows us to fetch Author Name and Avatar automatically

-- 1. Optional: Safely handle orphaned records (if any) by setting them to NULL
-- UPDATE posts 
-- SET author_id = NULL 
-- WHERE author_id IS NOT NULL 
-- AND author_id NOT IN (SELECT id FROM profiles);

-- 2. Add the Foreign Key Constraint
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_profiles 
FOREIGN KEY (author_id) 
REFERENCES profiles(id)
ON DELETE SET NULL; -- If a user is deleted, keep the post but remove author link

-- 3. Verify it works
-- SELECT * FROM posts JOIN profiles ON posts.author_id = profiles.id LIMIT 5;
