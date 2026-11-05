import { updatePassword } from "@/app/auth-actions";
import { AuthSetupNotice } from "@/components/auth/auth-setup-notice";
import { NewPasswordForm } from "@/components/auth/new-password-form";

export default function ResetPasswordPage() {
  return <section className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <h1 className="text-2xl font-semibold text-slate-900">تعيين كلمة مرور جديدة</h1>
    <p className="mb-6 mt-2 text-sm text-slate-600">اختر كلمة مرور جديدة لحسابك.</p>
    <AuthSetupNotice />
    <NewPasswordForm action={updatePassword} />
  </section>;
}
