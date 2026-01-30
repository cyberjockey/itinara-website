-- Create places table
create table places (
  id uuid default gen_random_uuid() primary key,
  destination_id uuid references destinations(id) on delete cascade not null,
  name text not null,
  type text, -- e.g. 'Sightseeing', 'Food', 'Culture'
  rating numeric(3, 1),
  status text default 'Open', -- 'Open', 'Closed', 'Temporarily Closed'
  location text,
  description text,
  image_url text,
  phone text,
  website text,
  social_media jsonb default '{}'::jsonb,
  price_level text,
  amenities jsonb default '[]'::jsonb,
  what_to_expect text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table places enable row level security;

create policy "Places are viewable by everyone."
  on places for select
  using ( true );

-- Seed Data (Example for Bali - assuming destination_id will be linked manually or by app logic)
-- You would run this after creating the table
-- insert into places (destination_id, name, type, rating, status, location) 
-- select id, 'Uluwatu Temple', 'Culture', 4.8, 'Open', 'Uluwatu, Bali' from destinations where name = 'Bali';
