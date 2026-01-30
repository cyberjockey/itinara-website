-- Create Static Pages Table
-- For managing editable static content like About, Contact, Policy pages

CREATE TABLE IF NOT EXISTS static_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,                   -- e.g., 'about', 'contact', 'privacy'
    title TEXT NOT NULL,
    content TEXT,                                -- Markdown/HTML content
    meta_title TEXT,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public Read Access (Only Published)
CREATE POLICY "Public can view published static pages"
ON static_pages FOR SELECT
USING (is_published = true);

-- Admin Full Access
CREATE POLICY "Admins can do everything on static pages"
ON static_pages FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Indexes for performance
CREATE INDEX idx_static_pages_slug ON static_pages(slug);
CREATE INDEX idx_static_pages_is_published ON static_pages(is_published);
