create or replace view public.available_unit_listings
with (security_invoker = false) as
select
  units.id,
  units.code,
  units.unit_type,
  units.floor,
  units.area_sqm,
  projects.name as project_name,
  projects.location as project_location,
  companies.name as company_name
from public.units
join public.projects on projects.id = units.project_id
join public.companies on companies.id = units.company_id
where units.status = 'available';

revoke all on table public.available_unit_listings from public;
grant select on table public.available_unit_listings to anon, authenticated;

create or replace function public.create_public_unit_interest(
  p_unit_id uuid,
  p_full_name text,
  p_phone text,
  p_email text default null,
  p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_project_id uuid;
  v_unit_code text;
  v_lead_id uuid;
begin
  if length(trim(coalesce(p_full_name, ''))) < 2 or length(trim(coalesce(p_phone, ''))) < 6 then
    raise exception 'invalid contact details';
  end if;
  if p_email is not null and trim(p_email) <> '' and p_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid email';
  end if;

  select company_id, project_id, code into v_company_id, v_project_id, v_unit_code
  from public.units where id = p_unit_id and status = 'available';
  if v_company_id is null then raise exception 'unit not available'; end if;

  insert into public.leads (company_id, full_name, phone, email, source, stage, interested_project_id, notes)
  values (v_company_id, trim(p_full_name), trim(p_phone), nullif(trim(coalesce(p_email, '')), ''), 'الموقع العام', 'new', v_project_id,
    concat('اهتمام بالوحدة: ', v_unit_code, case when nullif(trim(coalesce(p_message, '')), '') is null then '' else E'\n' || trim(p_message) end))
  returning id into v_lead_id;
  return v_lead_id;
end;
$$;

revoke all on function public.create_public_unit_interest(uuid, text, text, text, text) from public;
grant execute on function public.create_public_unit_interest(uuid, text, text, text, text) to anon, authenticated;
