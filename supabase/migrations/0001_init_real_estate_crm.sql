create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete restrict,
  full_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id
  from public.profiles
  where id = auth.uid()
$$;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  name text not null,
  location text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  project_id uuid not null references public.projects (id) on delete restrict,
  code text not null,
  unit_type text,
  floor text,
  area_sqm numeric(12, 2),
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, code)
);

create table public.unit_status_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  unit_id uuid not null references public.units (id) on delete cascade,
  from_status text,
  to_status text not null check (to_status in ('available', 'reserved', 'sold')),
  changed_by uuid references auth.users (id) on delete set null,
  changed_at timestamptz not null default now(),
  note text
);

create table public.brokers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  full_name text not null,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  full_name text not null,
  phone text,
  email text,
  source text,
  stage text not null default 'new'
    check (stage in ('new', 'follow_up', 'viewing', 'negotiation', 'won', 'lost')),
  assigned_broker_id uuid references public.brokers (id) on delete set null,
  interested_project_id uuid references public.projects (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  unit_id uuid references public.units (id) on delete set null,
  request_type text not null
    check (request_type in ('after_sales', 'maintenance')),
  title text not null,
  description text,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_company_id_idx on public.projects (company_id);
create index units_company_id_idx on public.units (company_id);
create index units_project_id_idx on public.units (project_id);
create index units_status_idx on public.units (company_id, status);
create index unit_status_events_unit_id_idx on public.unit_status_events (unit_id, changed_at desc);
create index brokers_company_id_idx on public.brokers (company_id);
create index leads_company_id_idx on public.leads (company_id);
create index leads_stage_idx on public.leads (company_id, stage);
create index leads_assigned_broker_id_idx on public.leads (assigned_broker_id);
create index service_requests_company_id_idx on public.service_requests (company_id);
create index service_requests_status_idx on public.service_requests (company_id, status);

create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger units_set_updated_at
before update on public.units
for each row execute function public.set_updated_at();

create trigger brokers_set_updated_at
before update on public.brokers
for each row execute function public.set_updated_at();

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create trigger service_requests_set_updated_at
before update on public.service_requests
for each row execute function public.set_updated_at();

create or replace function public.record_unit_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.unit_status_events (
      company_id,
      unit_id,
      from_status,
      to_status,
      changed_by
    )
    values (
      new.company_id,
      new.id,
      case when tg_op = 'INSERT' then null else old.status end,
      new.status,
      auth.uid()
    );
  end if;
  return new;
end;
$$;

create trigger units_record_status_change
after insert or update of status on public.units
for each row execute function public.record_unit_status_change();

revoke all on function public.record_unit_status_change() from public;

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.units enable row level security;
alter table public.unit_status_events enable row level security;
alter table public.brokers enable row level security;
alter table public.leads enable row level security;
alter table public.service_requests enable row level security;

create policy companies_select_own on public.companies
for select to authenticated
using (id = public.current_company_id());

create policy profiles_select_same_company on public.profiles
for select to authenticated
using (company_id = public.current_company_id());

create policy profiles_update_self on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid() and company_id = public.current_company_id());

create policy projects_select_company on public.projects
for select to authenticated
using (company_id = public.current_company_id());

create policy projects_insert_company on public.projects
for insert to authenticated
with check (company_id = public.current_company_id());

create policy projects_update_company on public.projects
for update to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy units_select_company on public.units
for select to authenticated
using (company_id = public.current_company_id());

create policy units_insert_company on public.units
for insert to authenticated
with check (company_id = public.current_company_id());

create policy units_update_company on public.units
for update to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy unit_status_events_select_company on public.unit_status_events
for select to authenticated
using (company_id = public.current_company_id());

create policy brokers_select_company on public.brokers
for select to authenticated
using (company_id = public.current_company_id());

create policy brokers_insert_company on public.brokers
for insert to authenticated
with check (company_id = public.current_company_id());

create policy brokers_update_company on public.brokers
for update to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy leads_select_company on public.leads
for select to authenticated
using (company_id = public.current_company_id());

create policy leads_insert_company on public.leads
for insert to authenticated
with check (company_id = public.current_company_id());

create policy leads_update_company on public.leads
for update to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy service_requests_select_company on public.service_requests
for select to authenticated
using (company_id = public.current_company_id());

create policy service_requests_insert_company on public.service_requests
for insert to authenticated
with check (company_id = public.current_company_id());

create policy service_requests_update_company on public.service_requests
for update to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

revoke all on function public.current_company_id() from public;
grant execute on function public.current_company_id() to authenticated;
