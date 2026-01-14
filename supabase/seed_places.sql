-- 1. Ensure Table Exists (Handles "relation 'places' does not exist" error)
CREATE TABLE IF NOT EXISTS places (
  id uuid default gen_random_uuid() primary key,
  destination_id uuid references destinations(id) on delete cascade not null,
  name text not null,
  type text, -- e.g. 'Sightseeing', 'Food', 'Culture'
  rating numeric(3, 1),
  status text default 'Open', -- 'Open', 'Closed', 'Temporarily Closed'
  location text,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS (Safe to re-run)
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Places are viewable by everyone." ON places FOR SELECT USING ( true );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Seed Data
DO $$
DECLARE
    bali_id uuid;
    komodo_id uuid;
    borobudur_id uuid;
    lombok_id uuid;
    jogja_id uuid;
    jakarta_id uuid;
    west_java_id uuid;
    central_java_id uuid;
BEGIN
    -- Get Destination IDs
    SELECT id INTO bali_id FROM destinations WHERE name ILIKE '%Bali%' LIMIT 1;
    SELECT id INTO komodo_id FROM destinations WHERE name ILIKE '%Komodo%' OR name ILIKE '%Lombok%' LIMIT 1; 
    SELECT id INTO lombok_id FROM destinations WHERE name ILIKE '%Lombok%' LIMIT 1;
    SELECT id INTO jogja_id FROM destinations WHERE name ILIKE '%Yogyakarta%' LIMIT 1;
    SELECT id INTO jakarta_id FROM destinations WHERE name ILIKE '%Jakarta%' LIMIT 1;
    SELECT id INTO west_java_id FROM destinations WHERE name ILIKE '%West Java%' LIMIT 1;
    SELECT id INTO central_java_id FROM destinations WHERE name ILIKE '%Central Java%' LIMIT 1;

    -- Insert Places for Bali
    IF bali_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM places WHERE destination_id = bali_id LIMIT 1) THEN
            INSERT INTO places (destination_id, name, type, rating, status, location, description) VALUES
            (bali_id, 'Uluwatu Temple', 'Culture', 4.8, 'Open', 'Uluwatu', 'Ancient sea temple on a cliff.'),
            (bali_id, 'Kecak Fire Dance', 'Performance', 4.9, 'Open', 'Uluwatu Temple', 'Traditional dance at sunset.'),
            (bali_id, 'Finns Beach Club', 'Club', 4.7, 'Open', 'Canggu', 'Popular beachfront venue.'),
            (bali_id, 'Sacred Monkey Forest', 'Nature', 4.6, 'Open', 'Ubud', 'Sanctuary with grey macaques.'),
            (bali_id, 'Tegallalang Rice Terrace', 'Nature', 4.7, 'Open', 'Ubud', 'Iconic terraced rice paddies.');
        END IF;
    END IF;

    -- Insert Places for Yogyakarta
    IF jogja_id IS NOT NULL THEN
         IF NOT EXISTS (SELECT 1 FROM places WHERE destination_id = jogja_id LIMIT 1) THEN
            INSERT INTO places (destination_id, name, type, rating, status, location, description) VALUES
            (jogja_id, 'Borobudur Temple', 'Culture', 4.9, 'Open', 'Magelang', 'World’s largest Buddhist temple.'),
            (jogja_id, 'Prambanan Temple', 'Culture', 4.8, 'Open', 'Sleman', 'Massive Hindu temple complex.'),
            (jogja_id, 'Malioboro Street', 'Shopping', 4.5, 'Open', 'Yogyakarta', 'Famous shopping street.'),
            (jogja_id, 'Taman Sari', 'History', 4.6, 'Open', 'Yogyakarta', 'Former royal garden and water castle.'),
            (jogja_id, 'Merapi Volcano Jeep Tour', 'Adventure', 4.8, 'Open', 'Kaliurang', 'Off-road adventure near the volcano.');
        END IF;
    END IF;

    -- Insert Places for Jakarta
    IF jakarta_id IS NOT NULL THEN
         IF NOT EXISTS (SELECT 1 FROM places WHERE destination_id = jakarta_id LIMIT 1) THEN
            INSERT INTO places (destination_id, name, type, rating, status, location, description) VALUES
            (jakarta_id, 'Monas (National Monument)', 'Landmark', 4.6, 'Open', 'Central Jakarta', 'Iconic symbol of Indonesian independence.'),
            (jakarta_id, 'Kota Tua (Old Town)', 'History', 4.5, 'Open', 'West Jakarta', 'Colonial Dutch buildings and museums.'),
            (jakarta_id, 'Grand Indonesia', 'Shopping', 4.8, 'Open', 'Central Jakarta', 'Massive luxury shopping mall.'),
            (jakarta_id, 'Ancol Dreamland', 'Activity', 4.4, 'Open', 'North Jakarta', 'Theme park and seaside recreational area.'),
            (jakarta_id, 'National Museum', 'Culture', 4.7, 'Open', 'Central Jakarta', 'Comprehensive collection of Indonesian heritage.');
        END IF;
    END IF;

    -- Insert Places for West Java
    IF west_java_id IS NOT NULL THEN
         IF NOT EXISTS (SELECT 1 FROM places WHERE destination_id = west_java_id LIMIT 1) THEN
            INSERT INTO places (destination_id, name, type, rating, status, location, description) VALUES
            (west_java_id, 'Kawah Putih', 'Nature', 4.6, 'Open', 'Ciwidey', 'Stunning white crater lake.'),
            (west_java_id, 'Tangkuban Perahu', 'Nature', 4.5, 'Open', 'Lembang', 'Active volcano with accessible crater.'),
            (west_java_id, 'Braga Street', 'Culture', 4.7, 'Open', 'Bandung', 'Historical street with cafes and colonial vibe.'),
            (west_java_id, 'Bogor Botanical Gardens', 'Nature', 4.8, 'Open', 'Bogor', 'Massive and oldest botanical garden in SE Asia.'),
            (west_java_id, 'Dusun Bambu', 'Food & Drink', 4.6, 'Open', 'Lembang', 'Family leisure park with lakes and dining.');
        END IF;
    END IF;

    -- Insert Places for Central Java
    IF central_java_id IS NOT NULL THEN
         IF NOT EXISTS (SELECT 1 FROM places WHERE destination_id = central_java_id LIMIT 1) THEN
            INSERT INTO places (destination_id, name, type, rating, status, location, description) VALUES
            (central_java_id, 'Lawang Sewu', 'History', 4.7, 'Open', 'Semarang', 'Famous colonial building with "thousand doors".'),
            (central_java_id, 'Dieng Plateau', 'Nature', 4.8, 'Open', 'Wonosobo', 'Highland plateau with colored lakes and temples.'),
            (central_java_id, 'Sam Poo Kong', 'Culture', 4.6, 'Open', 'Semarang', 'Oldest Chinese temple in Semarang.'),
            (central_java_id, 'Mangkunegaran Palace', 'Culture', 4.7, 'Open', 'Solo', 'Javanese palace with museum and performances.'),
            (central_java_id, 'Sikidang Crater', 'Nature', 4.5, 'Open', 'Dieng', 'Active crater with bubbling mud and steam.');
        END IF;
    END IF;

    -- Insert Places for Lombok & Sumbawa
    IF lombok_id IS NOT NULL THEN
         IF NOT EXISTS (SELECT 1 FROM places WHERE destination_id = lombok_id LIMIT 1) THEN
            INSERT INTO places (destination_id, name, type, rating, status, location, description) VALUES
            (lombok_id, 'Mount Rinjani', 'Adventure', 4.9, 'Open', 'Lombok', 'Active volcano famous for trekking.'),
            (lombok_id, 'Gili Trawangan', 'Relax', 4.8, 'Open', 'Gili Islands', 'Famous party island with clear waters.'),
            (lombok_id, 'Mandalika Beach', 'Nature', 4.7, 'Open', 'Kuta Lombok', 'Beautiful beach near the GP circuit.'),
            (lombok_id, 'Sade Village', 'Culture', 4.5, 'Open', 'Central Lombok', 'Traditional cloth weaving village.'),
            (lombok_id, 'Moyo Island', 'Nature', 4.8, 'Open', 'Sumbawa', 'Pristine island with waterfalls known for Diana''s visit.');
        END IF;
    END IF;

END $$;
