alter table public.units add column if not exists image_url text;

drop view if exists public.available_unit_listings;
create view public.available_unit_listings with (security_invoker = false) as
select units.id, units.code, units.unit_type, units.floor, units.area_sqm, units.image_url,
  projects.name as project_name, projects.location as project_location, projects.developer_phone,
  companies.name as company_name
from public.units
join public.projects on projects.id = units.project_id
join public.companies on companies.id = units.company_id
where units.status = 'available';

revoke all on table public.available_unit_listings from public;
grant select on table public.available_unit_listings to anon, authenticated;
