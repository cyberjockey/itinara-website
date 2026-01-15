-- ============================================
-- ITINARA: Local Guide Platform Schema
-- ============================================
-- Adds support for:
-- 1. User Roles (Traveler, Local Guide, Admin)
-- 2. Trip Templates (Curated itineraries)
-- 3. Guide Attribution (Places managed by guides)
-- 4. RLS Policies for new tables

-- 1. Update Profiles with Role & Guide Fields
-- ============================================
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'traveler' CHECK (role IN ('traveler', 'local_guide', 'admin')),
ADD COLUMN IF NOT EXISTS guide_bio TEXT,
ADD COLUMN IF NOT EXISTS guide_expertise TEXT[], -- e.g., ['Culture', 'Food']
ADD COLUMN IF NOT EXISTS guide_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS google_local_guide_level INTEGER;

-- 2. Create Trip Templates Table
-- ============================================
CREATE TABLE IF NOT EXISTS trip_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    destination_id UUID REFERENCES destinations(id),
    
    -- Content
    title TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'challenging')),
    price_range TEXT CHECK (price_range IN ('budget', 'mid', 'luxury')),
    tags TEXT[],
    
    -- Data
    itinerary JSONB NOT NULL DEFAULT '[]'::jsonb, -- Structured plan
    featured_image TEXT,
    gallery_images TEXT[],
    
    -- Stats
    use_count INTEGER DEFAULT 0,
    rating NUMERIC(3,2),
    review_count INTEGER DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Update Existing Tables for Guide Features
-- ============================================

-- Places: Attribution & Assets
ALTER TABLE places
ADD COLUMN IF NOT EXISTS guide_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_guide_curated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cloudinary_images TEXT[],
ADD COLUMN IF NOT EXISTS attachments JSONB;

-- Destinations: Management
ALTER TABLE destinations
ADD COLUMN IF NOT EXISTS managed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS guide_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS template_count INTEGER DEFAULT 0;

-- 4. Enable RLS on New Tables
-- ============================================
ALTER TABLE trip_templates ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- ============================================

-- A. Trip Templates
-- Everyone can view published templates
CREATE POLICY "Public view published templates"
    ON trip_templates FOR SELECT
    USING (status = 'published');

-- Guides can view their own drafts
CREATE POLICY "Guides view own templates"
    ON trip_templates FOR SELECT
    USING (auth.uid() = guide_id);

-- Admins can view all templates
CREATE POLICY "Admins view all templates"
    ON trip_templates FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Guides can create templates
CREATE POLICY "Guides insert templates"
    ON trip_templates FOR INSERT
    WITH CHECK (
        auth.uid() = guide_id AND 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('local_guide', 'admin'))
    );

-- Guides can update own templates
CREATE POLICY "Guides update own templates"
    ON trip_templates FOR UPDATE
    USING (auth.uid() = guide_id)
    WITH CHECK (auth.uid() = guide_id);

-- Admins can update any template
CREATE POLICY "Admins update all templates"
    ON trip_templates FOR UPDATE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- B. Destinations (Admins only for write)
CREATE POLICY "Admins manage destinations"
    ON destinations FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- Migration Complete
-- ============================================
