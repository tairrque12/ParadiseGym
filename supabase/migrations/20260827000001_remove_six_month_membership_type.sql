-- Keep the retired value valid for existing requests so staff can continue
-- updating their status. A trigger below prevents it from being selected for
-- new requests or assigned to another request.
alter table public.membership_requests
  drop constraint if exists membership_requests_membership_type_check;

alter table public.membership_requests
  add constraint membership_requests_membership_type_check
  check (
    membership_type in (
      '12_month_contract',
      'month_to_month',
      '1_year_paid_in_full',
      '6_months_paid_in_full',
      'one_month',
      'week_pass',
      'day_pass'
    )
  );

create or replace function public.enforce_current_membership_type()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.membership_type = '6_months_paid_in_full' then
    if tg_op = 'INSERT' then
      raise check_violation
        using constraint = 'membership_requests_membership_type_check';
    elsif old.membership_type is distinct from new.membership_type then
      raise check_violation
        using constraint = 'membership_requests_membership_type_check';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_current_membership_type
  on public.membership_requests;

create trigger enforce_current_membership_type
before insert or update of membership_type on public.membership_requests
for each row
execute function public.enforce_current_membership_type();
