-- membership_requests table
create table if not exists public.membership_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  age integer not null,
  membership_type text not null,
  status text not null default 'new'
);

alter table public.membership_requests enable row level security;

create policy "anon_insert_membership_requests"
  on public.membership_requests
  for insert
  to anon
  with check (true);

create policy "authenticated_select_membership_requests"
  on public.membership_requests
  for select
  to authenticated
  using (true);

create policy "authenticated_update_membership_requests"
  on public.membership_requests
  for update
  to authenticated
  using (true)
  with check (true);
