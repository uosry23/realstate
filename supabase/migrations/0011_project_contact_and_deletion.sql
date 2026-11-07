alter table public.projects add column if not exists developer_phone text;

drop view if exists public.available_unit_listings;

create view public.available_unit_listings
with (security_invoker = false) as
select units.id, units.code, units.unit_type, units.floor, units.area_sqm,
  projects.name as project_name, projects.location as project_location,
  projects.developer_phone, companies.name as company_name
from public.units
join public.projects on projects.id = units.project_id
join public.companies on companies.id = units.company_id
where units.status = 'available';

drop policy if exists units_delete_company_managers on public.units;
create policy units_delete_company_managers on public.units for delete to authenticated
using (company_id = private.current_company_id() and private.current_company_role() = 'manager');

drop policy if exists projects_delete_company_managers on public.projects;
create policy projects_delete_company_managers on public.projects for delete to authenticated
using (company_id = private.current_company_id() and private.current_company_role() = 'manager');
