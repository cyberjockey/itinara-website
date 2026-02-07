
-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY, -- e.g. 'first_trip'
    label TEXT NOT NULL,
    description TEXT,
    icon_name TEXT NOT NULL, -- Lucide icon name
    color_class TEXT NOT NULL, -- Tailwind classes
    criteria JSONB DEFAULT '{}'::jsonb, -- e.g. { type: 'trip_count', threshold: 1 }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ranks table
CREATE TABLE IF NOT EXISTS ranks (
    id TEXT PRIMARY KEY, -- e.g. 'Explorer'
    label TEXT NOT NULL,
    min_trips INTEGER NOT NULL DEFAULT 0,
    badge_style TEXT NOT NULL, -- Tailwind classes
    sequence INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;

-- Policies for achievements
CREATE POLICY "Achievements are viewable by everyone" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Achievements are editable by admins" ON achievements
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' 
        OR 
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- Policies for ranks
CREATE POLICY "Ranks are viewable by everyone" ON ranks
    FOR SELECT USING (true);

CREATE POLICY "Ranks are editable by admins" ON ranks
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
        OR 
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );
