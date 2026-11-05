"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthActionState } from "@/app/auth-actions";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    state: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600";

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-4">
      {isSignup ? (
        <>
          <label className="block text-sm font-medium text-slate-700">
            الاسم الكامل
            <input className={inputClass} name="full_name" autoComplete="name" required minLength={2} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            اسم الشركة <span className="font-normal text-slate-500">(اتركه فارغًا للانضمام بدعوة)</span>
            <input className={inputClass} name="company_name" autoComplete="organization" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            رمز دعوة الشركة (اختياري)
            <input className={inputClass} name="invitation_code" minLength={43} maxLength={43} pattern="[A-Za-z0-9_-]{43}" autoComplete="off" />
          </label>
        </>
      ) : null}
      <label className="block text-sm font-medium text-slate-700">
        البريد الإلكتروني
        <input className={inputClass} name="email" type="email" autoComplete="email" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        كلمة المرور
        <input className={inputClass} name="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} required minLength={8} />
      </label>
      {state.error ? <p role="alert" className="text-sm text-rose-700">{state.error}</p> : null}
      {state.message ? <p role="status" className="text-sm text-teal-800">{state.message}</p> : null}
      <button disabled={pending} className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-medium text-white outline-none hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-60">
        {pending ? "جارٍ التنفيذ..." : isSignup ? "إنشاء الحساب" : "تسجيل الدخول"}
      </button>
      {!isSignup ? <p className="text-center text-sm"><Link className="text-teal-800 underline" href="/forgot-password">نسيت كلمة المرور؟</Link></p> : null}
      <p className="text-center text-sm text-slate-600">
        {isSignup ? "لديك حساب؟ " : "شركة جديدة؟ "}
        <Link className="font-medium text-teal-800 underline focus-visible:outline-teal-700" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "تسجيل الدخول" : "إنشاء حساب الشركة"}
        </Link>
      </p>
    </form>
  );
}
