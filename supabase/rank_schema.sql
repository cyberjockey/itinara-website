-- Add rank columns to profiles table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rank_points') THEN
        ALTER TABLE profiles ADD COLUMN rank_points INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rank_tier') THEN
        ALTER TABLE profiles ADD COLUMN rank_tier TEXT DEFAULT 'Newcomer';
    END IF;
END $$;

-- Function to calculate rank tier based on points
CREATE OR REPLACE FUNCTION calculate_user_rank(points INTEGER)
RETURNS TEXT AS $$
BEGIN
    IF points >= 1000 THEN
        RETURN 'Legend';
    ELSIF points >= 600 THEN
        RETURN 'Expert';
    ELSIF points >= 300 THEN
        RETURN 'Adventurer';
    ELSIF points >= 100 THEN
        RETURN 'Explorer';
    ELSE
        RETURN 'Newcomer';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- RPC function to award points and update rank
CREATE OR REPLACE FUNCTION award_rank_points(p_user_id UUID, p_points INTEGER)
RETURNS VOID AS $$
DECLARE
    v_new_points INTEGER;
    v_new_tier TEXT;
BEGIN
    -- Update points
    UPDATE profiles 
    SET rank_points = rank_points + p_points
    WHERE id = p_user_id
    RETURNING rank_points INTO v_new_points;
    
    -- Calculate new tier
    v_new_tier := calculate_user_rank(v_new_points);
    
    -- Update tier
    UPDATE profiles 
    SET rank_tier = v_new_tier
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
