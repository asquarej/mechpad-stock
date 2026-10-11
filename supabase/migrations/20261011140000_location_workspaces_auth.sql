create table if not exists public.locations (
  name text primary key,
  code text not null unique check (char_length(code) = 3),
  active boolean not null default true
);

insert into public.locations (name, code) values
  ('Ibadan', 'IBA'),
  ('Ilupeju', 'ILU'),
  ('Kano', 'KAN'),
  ('Abuja', 'ABJ'),
  ('Akure', 'AKU'),
  ('Ilorin', 'ILO'),
  ('Asaba', 'ASA'),
  ('Ondo', 'OND')
on conflict (name) do update set code = excluded.code;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role text not null check (role in (
    'business_head',
    'manager',
    'finance',
    'inventory_officer',
    'workshop_officer',
    'technical_ops_lead'
  )),
  location text references public.locations (name),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint profile_scope_matches_role check (
    (role in ('business_head', 'manager') and location is null)
    or (role in ('finance', 'inventory_officer', 'workshop_officer', 'technical_ops_lead') and location is not null)
  )
);

create table if not exists public.inventory_workspaces (
  location text primary key references public.locations (name),
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

create or replace function public.mechanic_user_is_active()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active
  );
$$;

create or replace function public.mechanic_user_can_access_all_locations()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active
      and p.role in ('business_head', 'manager')
  );
$$;

create or replace function public.mechanic_user_location()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.location
  from public.profiles p
  where p.id = (select auth.uid())
    and p.active
  limit 1;
$$;

create or replace function public.mechanic_user_can_write_workspace()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active
      and p.role in (
        'business_head',
        'manager',
        'inventory_officer',
        'workshop_officer',
        'technical_ops_lead'
      )
  );
$$;

alter table public.locations enable row level security;
alter table public.profiles enable row level security;
alter table public.inventory_workspaces enable row level security;

drop policy if exists "Authenticated users can read active locations" on public.locations;
create policy "Authenticated users can read active locations"
  on public.locations for select
  to authenticated
  using (
    active
    and public.mechanic_user_is_active()
  );

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "Users can read allowed workspaces" on public.inventory_workspaces;
create policy "Users can read allowed workspaces"
  on public.inventory_workspaces for select
  to authenticated
  using (
    public.mechanic_user_can_access_all_locations()
    or location = public.mechanic_user_location()
  );

drop policy if exists "Users can create allowed workspaces" on public.inventory_workspaces;
create policy "Users can create allowed workspaces"
  on public.inventory_workspaces for insert
  to authenticated
  with check (
    public.mechanic_user_can_write_workspace()
    and (
    public.mechanic_user_can_access_all_locations()
    or location = public.mechanic_user_location()
    )
  );

drop policy if exists "Users can update allowed workspaces" on public.inventory_workspaces;
create policy "Users can update allowed workspaces"
  on public.inventory_workspaces for update
  to authenticated
  using (
    public.mechanic_user_can_write_workspace()
    and (
    public.mechanic_user_can_access_all_locations()
    or location = public.mechanic_user_location()
    )
  )
  with check (
    public.mechanic_user_can_write_workspace()
    and (
    public.mechanic_user_can_access_all_locations()
    or location = public.mechanic_user_location()
    )
  );

grant select on public.locations to authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update on public.inventory_workspaces to authenticated;
grant execute on function public.mechanic_user_is_active() to authenticated;
grant execute on function public.mechanic_user_can_access_all_locations() to authenticated;
grant execute on function public.mechanic_user_location() to authenticated;
grant execute on function public.mechanic_user_can_write_workspace() to authenticated;
