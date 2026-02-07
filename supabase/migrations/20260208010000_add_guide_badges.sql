
-- Create guide_badges table
CREATE TABLE IF NOT EXISTS guide_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guide_id, badge_type)
);

-- Enable RLS
ALTER TABLE guide_badges ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read badges
CREATE POLICY "Badges are viewable by everyone."
    ON guide_badges FOR SELECT
    USING (true);

-- Only system/triggers can insert (or admins) - For now, we'll allow service role or specific functions
-- But let's allow authenticated users to insert strict badges for themselves if we implement auto-award logic on client, 
-- though server-side is safer. For now, let's allow basic insert for development/MVP if needed, or stick to server-side.
-- Actually, let's keep it restricted. Only allow view.
-- Insertions should happen via database triggers or secure RPCs.

-- For now, let's creating a function to award a badge
CREATE OR REPLACE FUNCTION award_badge(target_guide_id UUID, badge_type_slug TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO guide_badges (guide_id, badge_type)
    VALUES (target_guide_id, badge_type_slug)
    ON CONFLICT (guide_id, badge_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
