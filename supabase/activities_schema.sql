-- Create a table for Activities
create table activities (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  day_number integer not null,
  start_time time,
  title text not null,
  location text,
  category text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Activities
alter table activities enable row level security;

-- We need a policy that allows access if the user owns the parent trip.
-- This usually requires a join or a helper function, but for simplicity in MVP 
-- we can rely on the fact that if you can see the trip, you can see the activities.
-- A robust way is:
create policy "Users can manage activities for their own trips."
  on activities for all
  using (
    exists (
      select 1 from trips
      where trips.id = activities.trip_id
      and trips.user_id = auth.uid()
    )
  );
