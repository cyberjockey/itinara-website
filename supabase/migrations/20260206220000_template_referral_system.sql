-- Template Referral Tracking System
-- Allows guides to generate shareable referral links and track performance metrics

-- Table: template_referral_links
-- Stores unique referral links for each template
CREATE TABLE IF NOT EXISTS template_referral_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES trip_templates(id) ON DELETE CASCADE,
    guide_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ref_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Ensure one referral link per template
    UNIQUE(template_id)
);

-- Index for fast lookups by ref_code
CREATE INDEX idx_template_referral_links_ref_code ON template_referral_links(ref_code);
CREATE INDEX idx_template_referral_links_template_id ON template_referral_links(template_id);
CREATE INDEX idx_template_referral_links_guide_id ON template_referral_links(guide_id);

-- Table: template_referral_events
-- Tracks all engagement events (views, clicks, purchases)
CREATE TABLE IF NOT EXISTS template_referral_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_code TEXT NOT NULL REFERENCES template_referral_links(ref_code) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'purchase')),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX idx_template_referral_events_ref_code ON template_referral_events(ref_code);
CREATE INDEX idx_template_referral_events_event_type ON template_referral_events(event_type);
CREATE INDEX idx_template_referral_events_created_at ON template_referral_events(created_at);
CREATE INDEX idx_template_referral_events_user_id ON template_referral_events(user_id) WHERE user_id IS NOT NULL;

-- RLS Policies for template_referral_links
ALTER TABLE template_referral_links ENABLE ROW LEVEL SECURITY;

-- Guides can view their own referral links
CREATE POLICY "Guides can view their own referral links"
    ON template_referral_links FOR SELECT
    USING (auth.uid() = guide_id);

-- Guides can create referral links for their templates
CREATE POLICY "Guides can create referral links for their templates"
    ON template_referral_links FOR INSERT
    WITH CHECK (
        auth.uid() = guide_id AND
        EXISTS (
            SELECT 1 FROM trip_templates
            WHERE trip_templates.id = template_id
            AND trip_templates.guide_id = auth.uid()
        )
    );

-- Guides can delete their own referral links
CREATE POLICY "Guides can delete their own referral links"
    ON template_referral_links FOR DELETE
    USING (auth.uid() = guide_id);

-- Public read access for referral link validation (needed for public landing pages)
CREATE POLICY "Public can read referral links"
    ON template_referral_links FOR SELECT
    USING (true);

-- RLS Policies for template_referral_events
ALTER TABLE template_referral_events ENABLE ROW LEVEL SECURITY;

-- Guides can view events for their referral links
CREATE POLICY "Guides can view their referral events"
    ON template_referral_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM template_referral_links
            WHERE template_referral_links.ref_code = template_referral_events.ref_code
            AND template_referral_links.guide_id = auth.uid()
        )
    );

-- Public insert access for tracking (API will validate)
CREATE POLICY "Public can insert tracking events"
    ON template_referral_events FOR INSERT
    WITH CHECK (true);

-- Function to generate short ref codes
CREATE OR REPLACE FUNCTION generate_ref_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    -- Generate 8-character random code
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Trigger to auto-generate ref_code if not provided
CREATE OR REPLACE FUNCTION set_ref_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ref_code IS NULL OR NEW.ref_code = '' THEN
        -- Keep trying until we get a unique code
        LOOP
            NEW.ref_code := generate_ref_code();
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM template_referral_links WHERE ref_code = NEW.ref_code
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ref_code
    BEFORE INSERT ON template_referral_links
    FOR EACH ROW
    EXECUTE FUNCTION set_ref_code();

-- View for analytics (makes queries easier)
CREATE OR REPLACE VIEW template_referral_analytics AS
SELECT 
    trl.id,
    trl.template_id,
    trl.guide_id,
    trl.ref_code,
    trl.created_at,
    COUNT(CASE WHEN tre.event_type = 'view' THEN 1 END) as total_views,
    COUNT(CASE WHEN tre.event_type = 'click' THEN 1 END) as total_clicks,
    COUNT(CASE WHEN tre.event_type = 'purchase' THEN 1 END) as total_purchases,
    COUNT(DISTINCT tre.session_id) as unique_visitors,
    CASE 
        WHEN COUNT(CASE WHEN tre.event_type = 'view' THEN 1 END) > 0 
        THEN ROUND(
            (COUNT(CASE WHEN tre.event_type = 'purchase' THEN 1 END)::numeric / 
             COUNT(CASE WHEN tre.event_type = 'view' THEN 1 END)::numeric) * 100, 
            2
        )
        ELSE 0 
    END as conversion_rate
FROM template_referral_links trl
LEFT JOIN template_referral_events tre ON trl.ref_code = tre.ref_code
GROUP BY trl.id, trl.template_id, trl.guide_id, trl.ref_code, trl.created_at;

-- Grant select on view to authenticated users
GRANT SELECT ON template_referral_analytics TO authenticated;
