-- Remove the discontinued six-month paid-in-full membership option.
alter table public.membership_requests
  drop constraint if exists membership_requests_membership_type_check;

alter table public.membership_requests
  add constraint membership_requests_membership_type_check
  check (
    membership_type in (
      '12_month_contract',
      'month_to_month',
      '1_year_paid_in_full',
      'one_month',
      'week_pass',
      'day_pass'
    )
  ) not valid;
