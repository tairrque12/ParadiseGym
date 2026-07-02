-- tour_requests table
create table if not exists public.tour_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  preferred_date date,
  preferred_time text,
  status text not null default 'new'
);

alter table public.tour_requests enable row level security;

create policy "anon_insert_tour_requests"
  on public.tour_requests
  for insert
  to anon
  with check (true);

create policy "authenticated_select_tour_requests"
  on public.tour_requests
  for select
  to authenticated
  using (true);

create policy "authenticated_update_tour_requests"
  on public.tour_requests
  for update
  to authenticated
  using (true)
  with check (true);
