do $$
declare
  missing_emails text;
begin
  select string_agg(expected.email, ', ')
  into missing_emails
  from (values
    ('adeoyeakanmu@gmail.com'),
    ('adeoyeakanmu+ibadan@gmail.com'),
    ('adeoyeakanmu+ilupeju@gmail.com'),
    ('adeoyeakanmu+kano@gmail.com'),
    ('adeoyeakanmu+abuja@gmail.com'),
    ('adeoyeakanmu+akure@gmail.com'),
    ('adeoyeakanmu+ilorin@gmail.com'),
    ('adeoyeakanmu+asaba@gmail.com'),
    ('adeoyeakanmu+ondo@gmail.com')
  ) as expected(email)
  where not exists (
    select 1
    from auth.users u
    where lower(u.email) = expected.email
  );

  if missing_emails is not null then
    raise exception 'Create these test users in Supabase Auth before running this script: %', missing_emails;
  end if;
end;
$$;

insert into public.profiles (id, display_name, role, location, active)
select
  u.id,
  account.display_name,
  account.role,
  account.location,
  true
from auth.users u
join (values
  ('adeoyeakanmu@gmail.com', 'Akanmu Adeoye - HQ', 'business_head', null::text),
  ('adeoyeakanmu+ibadan@gmail.com', 'Ibadan Test User', 'inventory_officer', 'Ibadan'),
  ('adeoyeakanmu+ilupeju@gmail.com', 'Ilupeju Test User', 'inventory_officer', 'Ilupeju'),
  ('adeoyeakanmu+kano@gmail.com', 'Kano Test User', 'inventory_officer', 'Kano'),
  ('adeoyeakanmu+abuja@gmail.com', 'Abuja Test User', 'inventory_officer', 'Abuja'),
  ('adeoyeakanmu+akure@gmail.com', 'Akure Test User', 'inventory_officer', 'Akure'),
  ('adeoyeakanmu+ilorin@gmail.com', 'Ilorin Test User', 'inventory_officer', 'Ilorin'),
  ('adeoyeakanmu+asaba@gmail.com', 'Asaba Test User', 'inventory_officer', 'Asaba'),
  ('adeoyeakanmu+ondo@gmail.com', 'Ondo Test User', 'inventory_officer', 'Ondo')
) as account(email, display_name, role, location)
  on lower(u.email) = account.email
on conflict (id) do update
set display_name = excluded.display_name,
    role = excluded.role,
    location = excluded.location,
    active = true;
