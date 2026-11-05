"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/app/auth-actions";

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600";

export function NewPasswordForm({ action }: { action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState> }) {
  const [state, formAction, pending] = useActionState(action, {});
  return <form action={formAction} className="space-y-4">
    <label className="block text-sm font-medium text-slate-700">كلمة المرور الجديدة<input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
    <label className="block text-sm font-medium text-slate-700">تأكيد كلمة المرور<input className={inputClass} name="password_confirmation" type="password" autoComplete="new-password" minLength={8} required /></label>
    {state.error ? <p role="alert" className="text-sm text-rose-700">{state.error}</p> : null}
    <button disabled={pending} className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-medium text-white disabled:opacity-60">{pending ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}</button>
  </form>;
}
