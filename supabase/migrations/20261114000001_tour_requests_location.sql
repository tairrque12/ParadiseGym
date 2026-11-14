-- Which gym a tour request is for. Existing rows were unlocated Harlingen requests.
alter table public.tour_requests
  add column if not exists location text not null default 'harlingen';

alter table public.tour_requests
  drop constraint if exists tour_requests_location_check;

alter table public.tour_requests
  add constraint tour_requests_location_check
  check (location in ('harlingen', 'mcallen'));

alter table public.tour_requests
  alter column location drop default;

-- Email is optional on the tour form. Phone remains required.
alter table public.tour_requests
  alter column email drop not null;
