
-- Force creation of guide_badges table (recovery migration)

CREATE TABLE IF NOT EXISTS guide_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guide_id, badge_type)
);

-- Enable RLS (idempotent)
ALTER TABLE guide_badges ENABLE ROW LEVEL SECURITY;

-- Policies (Drop first to avoid errors if exists)
DROP POLICY IF EXISTS "Badges are viewable by everyone." ON guide_badges;

CREATE POLICY "Badges are viewable by everyone."
    ON guide_badges FOR SELECT
    USING (true);

-- Functions
CREATE OR REPLACE FUNCTION award_badge(target_guide_id UUID, badge_type_slug TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO guide_badges (guide_id, badge_type)
    VALUES (target_guide_id, badge_type_slug)
    ON CONFLICT (guide_id, badge_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
