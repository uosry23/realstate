begin;
select plan(20);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
  'manager@crm-test.invalid', '', now(), '{"provider":"email","providers":["email"]}',
  '{"full_name":"مدير الاختبار","company_name":"شركة الاختبار"}', now(), now()
);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
  'other-manager@crm-test.invalid', '', now(), '{"provider":"email","providers":["email"]}',
  '{"full_name":"مدير شركة أخرى","company_name":"شركة أخرى"}', now(), now()
);

insert into public.company_invitations (
  company_id, invited_email, role, token_hash, created_by, expires_at
)
select company_id, 'employee@crm-test.invalid', 'employee',
  encode(digest('employee-test-invitation', 'sha256'), 'hex'),
  id, now() + interval '1 day'
from public.profiles
where id = '10000000-0000-4000-8000-000000000001';

insert into public.company_invitations (
  company_id, invited_email, role, token_hash, created_by, expires_at
)
select company_id, 'viewer@crm-test.invalid', 'viewer',
  encode(digest('viewer-test-invitation', 'sha256'), 'hex'),
  id, now() + interval '1 day'
from public.profiles
where id = '10000000-0000-4000-8000-000000000001';

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  (
    '10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated',
    'employee@crm-test.invalid', '', now(), '{"provider":"email","providers":["email"]}',
    '{"full_name":"موظف الاختبار","invitation_code":"employee-test-invitation"}', now(), now()
  ),
  (
    '10000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated',
    'viewer@crm-test.invalid', '', now(), '{"provider":"email","providers":["email"]}',
    '{"full_name":"مشاهدة الاختبار","invitation_code":"viewer-test-invitation"}', now(), now()
  );

insert into public.projects (id, company_id, name)
select '20000000-0000-4000-8000-000000000001', company_id, 'مشروع الشركة الأخرى'
from public.profiles where id = '10000000-0000-4000-8000-000000000002';

set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';

select is(private.current_company_role(), 'manager', 'new company owner is a manager');
select results_eq(
  $$select count(*)::bigint from public.profiles$$,
  array[3::bigint],
  'manager can see all members in the company'
);
select results_eq(
  $$insert into public.projects (company_id, name)
    select company_id, 'مشروع المدير'
    from public.profiles where id = '10000000-0000-4000-8000-000000000001'
    returning name$$,
  array['مشروع المدير'::text],
  'manager can create operational records'
);
select results_eq(
  $$select count(*)::bigint from public.projects
    where id = '20000000-0000-4000-8000-000000000001'$$,
  array[0::bigint],
  'manager cannot read another company records'
);

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000003';
select is(private.current_company_role(), 'employee', 'invited account receives its assigned employee role');
select results_eq(
  $$insert into public.projects (company_id, name)
    select company_id, 'مشروع الموظف'
    from public.profiles where id = '10000000-0000-4000-8000-000000000003'
    returning name$$,
  array['مشروع الموظف'::text],
  'employee can create operational records'
);
select results_eq(
  $$select count(*)::bigint from public.profiles$$,
  array[1::bigint],
  'employee sees only their own profile'
);
select throws_ok(
  $$insert into public.company_invitations (company_id, invited_email, role, token_hash, created_by, expires_at)
    select company_id, 'unauthorized@crm-test.invalid', 'viewer', repeat('a', 64), id, now() + interval '1 day'
    from public.profiles where id = '10000000-0000-4000-8000-000000000003'$$,
  '42501', null,
  'employee cannot manage company invitations'
);
select is_empty(
  $$update public.profiles set role = 'manager'
    where id = '10000000-0000-4000-8000-000000000001' returning id$$,
  'employee cannot change member roles'
);
select results_eq(
  $$select count(*)::bigint from public.projects
    where id = '20000000-0000-4000-8000-000000000001'$$,
  array[0::bigint],
  'employee cannot read another company records'
);

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000004';
select is(private.current_company_role(), 'viewer', 'invited account receives its assigned viewer role');
select results_eq(
  $$select count(*)::bigint from public.projects$$,
  array[2::bigint],
  'viewer can read company operational records'
);
select results_eq(
  $$select count(*)::bigint from public.profiles$$,
  array[1::bigint],
  'viewer sees only their own profile'
);
select throws_ok(
  $$insert into public.projects (company_id, name)
    select company_id, 'مشروع المشاهد'
    from public.profiles where id = '10000000-0000-4000-8000-000000000004'$$,
  '42501', null,
  'viewer cannot create operational records'
);
select is_empty(
  $$update public.projects set name = 'تعديل غير مسموح'
    where name = 'مشروع المدير' returning id$$,
  'viewer cannot update operational records'
);
select results_eq(
  $$select count(*)::bigint from public.company_invitations$$,
  array[0::bigint],
  'viewer cannot read company invitations'
);

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';
select results_eq(
  $$insert into public.company_invitations (company_id, invited_email, role, token_hash, created_by, expires_at)
    select company_id, 'new-viewer@crm-test.invalid', 'viewer', repeat('b', 64), id, now() + interval '1 day'
    from public.profiles where id = '10000000-0000-4000-8000-000000000001'
    returning invited_email$$,
  array['new-viewer@crm-test.invalid'::text],
  'manager can create company invitations'
);
select results_eq(
  $$update public.profiles set role = 'viewer'
    where id = '10000000-0000-4000-8000-000000000003' returning role$$,
  array['viewer'::text],
  'manager can change a company member role'
);
select throws_ok(
  $$update public.profiles set role = 'viewer'
    where id = '10000000-0000-4000-8000-000000000001' returning id$$,
  'P0001', 'A company must retain at least one manager',
  'database prevents removal of the last manager'
);
select results_eq(
  $$select name from public.projects where name = 'مشروع المدير'$$,
  array['مشروع المدير'::text],
  'viewer update attempt left the original record unchanged'
);

select * from finish();
rollback;
