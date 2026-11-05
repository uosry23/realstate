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
      'العقار'
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

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
