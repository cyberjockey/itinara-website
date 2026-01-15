-- Allow authenticated users to insert new places
create policy "Enable insert for authenticated users only"
on places for insert
to authenticated
with check (true);

-- Allow authenticated users to update places
create policy "Enable update for authenticated users only"
on places for update
to authenticated
using (true)
with check (true);

-- Allow authenticated users to delete places
create policy "Enable delete for authenticated users only"
on places for delete
to authenticated
using (true);
