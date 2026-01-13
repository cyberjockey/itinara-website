-- Create a table for Destinations
create table destinations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  location text,
  image_url text,
  rating numeric(2, 1),
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved Destinations (Many-to-Many relationship between Users and Destinations)
create table saved_destinations (
  user_id uuid references profiles(id) on delete cascade not null,
  destination_id uuid references destinations(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, destination_id)
);

-- RLS
alter table destinations enable row level security;
alter table saved_destinations enable row level security;

-- Everyone can read destinations
create policy "Public destinations are viewable by everyone."
  on destinations for select
  using ( true );

-- Only authenticated users can manage their saved destinations
create policy "Users can manage their own saved destinations."
  on saved_destinations for all
  using ( auth.uid() = user_id );


-- SEED DATA (Optional, but helpful for testing)
insert into destinations (name, description, location, image_url, rating, tags)
values 
(
  'Uluwatu Temple', 
  'A Balinese Hindu sea temple located in Uluwatu.', 
  'Bali, Indonesia', 
  '/images/hero-bg.png', 
  4.8, 
  ARRAY['Culture', 'Nature', 'Sightseeing']
),
(
  'Komodo National Park', 
  'Home to the famous Komodo dragons and world-class diving.', 
  'East Nusa Tenggara', 
  '/images/hero-bg.png', 
  4.9, 
  ARRAY['Adventure', 'Wildlife', 'Diving']
),
(
  'Borobudur Temple', 
  'The world''s largest Buddhist temple.', 
  'Magelang, Central Java', 
  '/images/hero-bg.png', 
  4.7, 
  ARRAY['Culture', 'History', 'Sightseeing']
);
