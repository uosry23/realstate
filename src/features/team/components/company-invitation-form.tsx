"use client";

import { useActionState } from "react";
import { createCompanyInvitation, type InvitationActionState } from "@/features/team/actions";
import { COMPANY_ROLE_LABELS } from "@/features/team/types";
import { inputClass, labelClass } from "@/components/ui/form-controls";

const initialState: InvitationActionState = {};

export function CompanyInvitationForm() {
  const [state, formAction, pending] = useActionState(createCompanyInvitation, initialState);
  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">دعوة عضو جديد</h2>
      <p className="mb-4 mt-1 text-sm text-slate-600">ينشئ النظام رمزًا صالحًا لمدة 7 أيام. شاركه مع الشخص عبر قناة آمنة؛ يجب أن يسجل بالبريد نفسه.</p>
      <form action={formAction} className="grid gap-4 md:grid-cols-[1fr_14rem_auto] md:items-end">
        <label className={labelClass}>البريد الإلكتروني<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
        <label className={labelClass}>الدور<select className={inputClass} name="role" defaultValue="employee">
          {Object.entries(COMPANY_ROLE_LABELS).map(([role, label]) => <option key={role} value={role}>{label}</option>)}
        </select></label>
        <button disabled={pending} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white outline-none hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-60">{pending ? "جارٍ الإنشاء..." : "إنشاء رمز الدعوة"}</button>
      </form>
      {state.error ? <p role="alert" className="mt-3 text-sm text-rose-700">{state.error}</p> : null}
      {state.invitationCode ? <div role="status" className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4 text-teal-950">
        <p className="text-sm">رمز دعوة {state.invitedEmail}. يظهر مرة واحدة فقط:</p>
        <input className="mt-2 w-full select-all rounded border border-teal-300 bg-white p-2 font-mono text-sm" dir="ltr" readOnly value={state.invitationCode} aria-label="رمز الدعوة" onFocus={(event) => event.currentTarget.select()} />
        <p className="mt-2 text-xs">أدخل الرمز في نموذج إنشاء الحساب. إذا فقدته، ألغِ الدعوة وأنشئ رمزًا جديدًا.</p>
      </div> : null}
    </section>
  );
}
