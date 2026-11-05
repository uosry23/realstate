create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company_id uuid;
  user_full_name text;
  new_company_name text;
begin
  user_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(new.email, '@', 1), ''),
    'مستخدم جديد'
  );
  new_company_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'company_name'), ''),
    'شركة جديدة'
  );

  insert into public.companies (name)
  values (new_company_name)
  returning id into new_company_id;

  insert into public.profiles (id, company_id, full_name)
  values (new.id, new_company_id, user_full_name);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
