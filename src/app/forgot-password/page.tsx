import Link from "next/link";
import { requestPasswordReset } from "@/app/auth-actions";
import { AuthSetupNotice } from "@/components/auth/auth-setup-notice";
import { PasswordResetRequestForm } from "@/components/auth/password-reset-request-form";

export default function ForgotPasswordPage() {
  return <section className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <h1 className="text-2xl font-semibold text-slate-900">استعادة كلمة المرور</h1>
    <p className="mb-6 mt-2 text-sm text-slate-600">أدخل بريدك وسنرسل رابطًا لإعادة تعيين كلمة المرور إذا كان مسجلًا.</p>
    <AuthSetupNotice />
    <PasswordResetRequestForm action={requestPasswordReset} />
    <p className="mt-4 text-center text-sm"><Link className="text-teal-800 underline" href="/login">العودة لتسجيل الدخول</Link></p>
  </section>;
}
