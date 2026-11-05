alter table public.projects
  add constraint projects_id_company_unique unique (id, company_id);

alter table public.brokers
  add constraint brokers_id_company_unique unique (id, company_id);

alter table public.units
  add constraint units_id_company_unique unique (id, company_id);

alter table public.leads
  add constraint leads_id_company_unique unique (id, company_id);

alter table public.units
  add constraint units_project_company_fkey
  foreign key (project_id, company_id)
  references public.projects (id, company_id)
  not valid;

alter table public.unit_status_events
  add constraint unit_status_events_unit_company_fkey
  foreign key (unit_id, company_id)
  references public.units (id, company_id)
  on delete cascade
  not valid;

alter table public.leads
  add constraint leads_broker_company_fkey
  foreign key (assigned_broker_id, company_id)
  references public.brokers (id, company_id)
  not valid;

alter table public.leads
  add constraint leads_project_company_fkey
  foreign key (interested_project_id, company_id)
  references public.projects (id, company_id)
  not valid;

alter table public.service_requests
  add constraint service_requests_unit_company_fkey
  foreign key (unit_id, company_id)
  references public.units (id, company_id)
  not valid;

alter table public.lead_follow_ups
  add constraint lead_follow_ups_lead_company_fkey
  foreign key (lead_id, company_id)
  references public.leads (id, company_id)
  on delete cascade
  not valid;
