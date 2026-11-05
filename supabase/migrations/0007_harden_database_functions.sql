create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.current_company_id()
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

create or replace function private.current_company_role()
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

revoke all on function private.current_company_id() from public, anon;
revoke all on function private.current_company_role() from public, anon;
grant execute on function private.current_company_id() to authenticated;
grant execute on function private.current_company_role() to authenticated;

drop policy if exists companies_select_own on public.companies;
create policy companies_select_own on public.companies
for select to authenticated
using (id = private.current_company_id());

drop policy if exists profiles_select_self_or_manager on public.profiles;
create policy profiles_select_self_or_manager on public.profiles
for select to authenticated
using (
  id = auth.uid()
  or (company_id = private.current_company_id() and private.current_company_role() = 'manager')
);

drop policy if exists profiles_update_manager on public.profiles;
create policy profiles_update_manager on public.profiles
for update to authenticated
using (
  company_id = private.current_company_id()
  and private.current_company_role() = 'manager'
)
with check (company_id = private.current_company_id());

drop policy if exists company_invitations_select_manager on public.company_invitations;
create policy company_invitations_select_manager on public.company_invitations
for select to authenticated
using (
  company_id = private.current_company_id()
  and private.current_company_role() = 'manager'
);

drop policy if exists company_invitations_insert_manager on public.company_invitations;
create policy company_invitations_insert_manager on public.company_invitations
for insert to authenticated
with check (
  company_id = private.current_company_id()
  and private.current_company_role() = 'manager'
  and created_by = auth.uid()
);

drop policy if exists company_invitations_update_manager on public.company_invitations;
create policy company_invitations_update_manager on public.company_invitations
for update to authenticated
using (
  company_id = private.current_company_id()
  and private.current_company_role() = 'manager'
)
with check (
  company_id = private.current_company_id()
  and private.current_company_role() = 'manager'
);

drop policy if exists projects_select_company on public.projects;
create policy projects_select_company on public.projects
for select to authenticated
using (company_id = private.current_company_id());
drop policy if exists projects_insert_company_writers on public.projects;
create policy projects_insert_company_writers on public.projects
for insert to authenticated
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));
drop policy if exists projects_update_company_writers on public.projects;
create policy projects_update_company_writers on public.projects
for update to authenticated
using (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'))
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));

drop policy if exists units_select_company on public.units;
create policy units_select_company on public.units
for select to authenticated
using (company_id = private.current_company_id());
drop policy if exists units_insert_company_writers on public.units;
create policy units_insert_company_writers on public.units
for insert to authenticated
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));
drop policy if exists units_update_company_writers on public.units;
create policy units_update_company_writers on public.units
for update to authenticated
using (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'))
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));

drop policy if exists unit_status_events_select_company on public.unit_status_events;
create policy unit_status_events_select_company on public.unit_status_events
for select to authenticated
using (company_id = private.current_company_id());

drop policy if exists brokers_select_company on public.brokers;
create policy brokers_select_company on public.brokers
for select to authenticated
using (company_id = private.current_company_id());
drop policy if exists brokers_insert_company_writers on public.brokers;
create policy brokers_insert_company_writers on public.brokers
for insert to authenticated
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));
drop policy if exists brokers_update_company_writers on public.brokers;
create policy brokers_update_company_writers on public.brokers
for update to authenticated
using (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'))
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));

drop policy if exists leads_select_company on public.leads;
create policy leads_select_company on public.leads
for select to authenticated
using (company_id = private.current_company_id());
drop policy if exists leads_insert_company_writers on public.leads;
create policy leads_insert_company_writers on public.leads
for insert to authenticated
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));
drop policy if exists leads_update_company_writers on public.leads;
create policy leads_update_company_writers on public.leads
for update to authenticated
using (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'))
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));

drop policy if exists service_requests_select_company on public.service_requests;
create policy service_requests_select_company on public.service_requests
for select to authenticated
using (company_id = private.current_company_id());
drop policy if exists service_requests_insert_company_writers on public.service_requests;
create policy service_requests_insert_company_writers on public.service_requests
for insert to authenticated
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));
drop policy if exists service_requests_update_company_writers on public.service_requests;
create policy service_requests_update_company_writers on public.service_requests
for update to authenticated
using (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'))
with check (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'));

drop policy if exists lead_follow_ups_select_company on public.lead_follow_ups;
create policy lead_follow_ups_select_company on public.lead_follow_ups
for select to authenticated
using (company_id = private.current_company_id());
drop policy if exists lead_follow_ups_insert_company_writers on public.lead_follow_ups;
create policy lead_follow_ups_insert_company_writers on public.lead_follow_ups
for insert to authenticated
with check (
  company_id = private.current_company_id()
  and private.current_company_role() in ('manager', 'employee')
  and created_by = auth.uid()
  and exists (select 1 from public.leads where leads.id = lead_follow_ups.lead_id and leads.company_id = private.current_company_id())
);
drop policy if exists lead_follow_ups_update_company_writers on public.lead_follow_ups;
create policy lead_follow_ups_update_company_writers on public.lead_follow_ups
for update to authenticated
using (company_id = private.current_company_id() and private.current_company_role() in ('manager', 'employee'))
with check (
  company_id = private.current_company_id()
  and private.current_company_role() in ('manager', 'employee')
  and exists (select 1 from public.leads where leads.id = lead_follow_ups.lead_id and leads.company_id = private.current_company_id())
);

revoke all on function public.current_company_id() from public, anon, authenticated;
revoke all on function public.current_company_role() from public, anon, authenticated;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.prevent_last_company_manager_removal() from public, anon, authenticated;
revoke all on function public.record_unit_status_change() from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
alter function public.set_updated_at() set search_path = public;
