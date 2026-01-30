-- Create Landing Pages Table
-- For campaign-specific pages with flexible JSON block structure

CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,                   -- e.g., 'summer-sale-2026'
    title TEXT NOT NULL,
    -- JSON structure for page blocks (Hero, Features, CTA, etc.)
    -- Example: [{ "type": "hero", "data": { "title": "...", "subtitle": "...", "image": "..." } }]
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    meta_title TEXT,
    meta_description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public Read Access (Only Published)
CREATE POLICY "Public can view published landing pages"
ON landing_pages FOR SELECT
USING (status = 'published');

-- Admin Full Access
CREATE POLICY "Admins can do everything on landing pages"
ON landing_pages FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Indexes for performance
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX idx_landing_pages_status ON landing_pages(status);
CREATE INDEX idx_landing_pages_published_at ON landing_pages(published_at);
