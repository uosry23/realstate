"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/app/auth-actions";

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600";

export function PasswordResetRequestForm({ action }: { action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState> }) {
  const [state, formAction, pending] = useActionState(action, {});
  return <form action={formAction} className="space-y-4">
    <label className="block text-sm font-medium text-slate-700">البريد الإلكتروني<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
    {state.error ? <p role="alert" className="text-sm text-rose-700">{state.error}</p> : null}
    {state.message ? <p role="status" className="text-sm text-teal-800">{state.message}</p> : null}
    <button disabled={pending} className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-medium text-white disabled:opacity-60">{pending ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}</button>
  </form>;
}
