create table public.lead_follow_ups (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete restrict,
  lead_id uuid not null references public.leads (id) on delete cascade,
  note text not null,
  due_at timestamptz,
  completed_at timestamptz,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lead_follow_ups_note_length check (length(trim(note)) >= 2)
);

create index lead_follow_ups_company_lead_due_idx
  on public.lead_follow_ups (company_id, lead_id, due_at, created_at desc);

create trigger lead_follow_ups_set_updated_at
before update on public.lead_follow_ups
for each row execute function public.set_updated_at();

alter table public.lead_follow_ups enable row level security;

create policy lead_follow_ups_select_company on public.lead_follow_ups
for select to authenticated
using (company_id = public.current_company_id());

create policy lead_follow_ups_insert_company on public.lead_follow_ups
for insert to authenticated
with check (
  company_id = public.current_company_id()
  and created_by = auth.uid()
  and exists (
    select 1 from public.leads
    where leads.id = lead_follow_ups.lead_id
      and leads.company_id = public.current_company_id()
  )
);

create policy lead_follow_ups_update_company on public.lead_follow_ups
for update to authenticated
using (company_id = public.current_company_id())
with check (
  company_id = public.current_company_id()
  and exists (
    select 1 from public.leads
    where leads.id = lead_follow_ups.lead_id
      and leads.company_id = public.current_company_id()
  )
);
