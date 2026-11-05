create index profiles_company_id_idx on public.profiles (company_id);

create index company_invitations_created_by_idx on public.company_invitations (created_by);
create index company_invitations_accepted_user_id_idx on public.company_invitations (accepted_user_id);

create index lead_follow_ups_lead_id_company_id_idx on public.lead_follow_ups (lead_id, company_id);
create index lead_follow_ups_created_by_idx on public.lead_follow_ups (created_by);

create index leads_assigned_broker_id_company_id_idx on public.leads (assigned_broker_id, company_id);
create index leads_interested_project_id_company_id_idx on public.leads (interested_project_id, company_id);

create index service_requests_unit_id_company_id_idx on public.service_requests (unit_id, company_id);

create index unit_status_events_company_id_idx on public.unit_status_events (company_id);
create index unit_status_events_unit_id_company_id_idx on public.unit_status_events (unit_id, company_id);
create index unit_status_events_changed_by_idx on public.unit_status_events (changed_by);

create index units_project_id_company_id_idx on public.units (project_id, company_id);

drop policy if exists profiles_select_self_or_manager on public.profiles;
create policy profiles_select_self_or_manager on public.profiles
for select to authenticated
using (
  id = (select auth.uid())
  or (company_id = private.current_company_id() and private.current_company_role() = 'manager')
);

drop policy if exists company_invitations_insert_manager on public.company_invitations;
create policy company_invitations_insert_manager on public.company_invitations
for insert to authenticated
with check (
  company_id = private.current_company_id()
  and private.current_company_role() = 'manager'
  and created_by = (select auth.uid())
);

drop policy if exists lead_follow_ups_insert_company_writers on public.lead_follow_ups;
create policy lead_follow_ups_insert_company_writers on public.lead_follow_ups
for insert to authenticated
with check (
  company_id = private.current_company_id()
  and private.current_company_role() in ('manager', 'employee')
  and created_by = (select auth.uid())
  and exists (
    select 1
    from public.leads
    where leads.id = lead_follow_ups.lead_id
      and leads.company_id = private.current_company_id()
  )
);
