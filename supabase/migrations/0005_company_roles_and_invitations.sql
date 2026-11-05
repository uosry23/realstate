alter table public.profiles
  add column role text not null default 'employee'
  check (role in ('manager', 'employee', 'viewer'));

with ranked_profiles as (
  select id, row_number() over (partition by company_id order by created_at, id) as position
  from public.profiles
)
update public.profiles
set role = case when ranked_profiles.position = 1 then 'manager' else 'employee' end
from ranked_profiles
where profiles.id = ranked_profiles.id;

create table public.company_invitations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  invited_email text not null check (invited_email = lower(trim(invited_email))),
  role text not null check (role in ('manager', 'employee', 'viewer')),
  token_hash text not null unique,
  created_by uuid not null references auth.users (id) on delete restrict,
  accepted_user_id uuid references auth.users (id) on delete set null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint company_invitation_state_check check (not (accepted_at is not null and revoked_at is not null))
);

create index company_invitations_company_created_idx
  on public.company_invitations (company_id, created_at desc);

create unique index company_invitations_one_pending_email_idx
  on public.company_invitations (company_id, invited_email)
  where accepted_at is null and revoked_at is null;

alter table public.company_invitations enable row level security;

create or replace function public.current_company_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

revoke all on function public.current_company_role() from public;
grant execute on function public.current_company_role() to authenticated;

drop policy if exists profiles_select_same_company on public.profiles;
create policy profiles_select_self_or_manager on public.profiles
for select to authenticated
using (
  id = auth.uid()
  or (company_id = public.current_company_id() and public.current_company_role() = 'manager')
);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_manager on public.profiles
for update to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() = 'manager'
)
with check (company_id = public.current_company_id());

create policy company_invitations_select_manager on public.company_invitations
for select to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() = 'manager'
);

create policy company_invitations_insert_manager on public.company_invitations
for insert to authenticated
with check (
  company_id = public.current_company_id()
  and public.current_company_role() = 'manager'
  and created_by = auth.uid()
);

create policy company_invitations_update_manager on public.company_invitations
for update to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() = 'manager'
)
with check (
  company_id = public.current_company_id()
  and public.current_company_role() = 'manager'
);

drop policy if exists projects_insert_company on public.projects;
create policy projects_insert_company_writers on public.projects
for insert to authenticated
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);
drop policy if exists projects_update_company on public.projects;
create policy projects_update_company_writers on public.projects
for update to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
)
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);

drop policy if exists units_insert_company on public.units;
create policy units_insert_company_writers on public.units
for insert to authenticated
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);
drop policy if exists units_update_company on public.units;
create policy units_update_company_writers on public.units
for update to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
)
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);

drop policy if exists brokers_insert_company on public.brokers;
create policy brokers_insert_company_writers on public.brokers
for insert to authenticated
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);
drop policy if exists brokers_update_company on public.brokers;
create policy brokers_update_company_writers on public.brokers
for update to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
)
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);

drop policy if exists leads_insert_company on public.leads;
create policy leads_insert_company_writers on public.leads
for insert to authenticated
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);
drop policy if exists leads_update_company on public.leads;
create policy leads_update_company_writers on public.leads
for update to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
)
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);

drop policy if exists service_requests_insert_company on public.service_requests;
create policy service_requests_insert_company_writers on public.service_requests
for insert to authenticated
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);
drop policy if exists service_requests_update_company on public.service_requests;
create policy service_requests_update_company_writers on public.service_requests
for update to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
)
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
);

drop policy if exists lead_follow_ups_insert_company on public.lead_follow_ups;
create policy lead_follow_ups_insert_company_writers on public.lead_follow_ups
for insert to authenticated
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
  and created_by = auth.uid()
  and exists (
    select 1 from public.leads
    where leads.id = lead_follow_ups.lead_id
      and leads.company_id = public.current_company_id()
  )
);

drop policy if exists lead_follow_ups_update_company on public.lead_follow_ups;
create policy lead_follow_ups_update_company_writers on public.lead_follow_ups
for update to authenticated
using (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
)
with check (
  company_id = public.current_company_id()
  and public.current_company_role() in ('manager', 'employee')
  and exists (
    select 1 from public.leads
    where leads.id = lead_follow_ups.lead_id
      and leads.company_id = public.current_company_id()
  )
);

create or replace function public.prevent_last_company_manager_removal()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining_managers integer;
  manager_removed boolean := false;
begin
  if old.role = 'manager' then
    if tg_op = 'DELETE' then
      manager_removed := true;
    else
      manager_removed := new.role <> 'manager';
    end if;
    if manager_removed then
      perform 1 from public.companies where id = old.company_id for update;
      select count(*) into remaining_managers
      from public.profiles
      where company_id = old.company_id
        and role = 'manager'
        and id <> old.id;
      if remaining_managers = 0 then
        raise exception 'A company must retain at least one manager';
      end if;
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger profiles_prevent_last_manager_removal
before update of role on public.profiles
for each row execute function public.prevent_last_company_manager_removal();

create trigger profiles_prevent_last_manager_deletion
before delete on public.profiles
for each row execute function public.prevent_last_company_manager_removal();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_company_id uuid;
  user_full_name text;
  new_company_name text;
  invitation_code text;
  invitation public.company_invitations%rowtype;
begin
  user_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(new.email, '@', 1), ''),
    'مستخدم جديد'
  );
  invitation_code := nullif(trim(new.raw_user_meta_data ->> 'invitation_code'), '');

  if invitation_code is not null then
    select * into invitation
    from public.company_invitations
    where token_hash = encode(digest(invitation_code, 'sha256'), 'hex')
      and invited_email = lower(trim(new.email))
      and accepted_at is null
      and revoked_at is null
      and expires_at > now()
    for update;
    if not found then
      raise exception 'Invitation is invalid, expired, or assigned to another email';
    end if;
    new_company_id := invitation.company_id;
    update public.company_invitations
    set accepted_at = now(), accepted_user_id = new.id
    where id = invitation.id;
  else
    new_company_name := coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'company_name'), ''),
      'شركة جديدة'
    );
    insert into public.companies (name)
    values (new_company_name)
    returning id into new_company_id;
  end if;

  insert into public.profiles (id, company_id, full_name, role)
  values (
    new.id,
    new_company_id,
    user_full_name,
    case when invitation_code is null then 'manager' else invitation.role end
  );

  if invitation_code is not null then
    update auth.users
    set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) - 'invitation_code'
    where id = new.id;
  end if;

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public;
revoke all on function public.prevent_last_company_manager_removal() from public;
