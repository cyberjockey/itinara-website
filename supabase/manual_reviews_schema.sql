-- Add map_embed_url to destinations
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS map_embed_url text;

-- Create Reviews table for manual scraping
create table reviews (
  id uuid default gen_random_uuid() primary key,
  destination_id uuid references destinations(id) on delete cascade not null,
  author_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  text text,
  relative_time_description text, -- e.g. "2 weeks ago"
  profile_photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table reviews enable row level security;

create policy "Public reviews are viewable by everyone."
  on reviews for select
  using ( true );

-- For now, manual insertion via SQL editor is fine, but if we build an admin panel later:
create policy "Admins can insert reviews."
  on reviews for insert
  with check ( true ); -- You might want to restrict this in production

-- SEED DATA UPDATE (Example)
-- You will need to manually find the destination UUIDs to insert reviews linked to them.
-- For the map URL, you can update existing rows:
-- UPDATE destinations SET map_embed_url = 'https://www.google.com/maps/embed?pb=...' WHERE name = 'Uluwatu Temple';
