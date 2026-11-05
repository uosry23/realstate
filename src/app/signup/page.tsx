import { signUp } from "@/app/auth-actions";
import { AuthSetupNotice } from "@/components/auth/auth-setup-notice";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <section className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold text-slate-900">إنشاء حساب الشركة</h1>
      <p className="mb-6 mt-2 text-sm text-slate-600">أنشئ حسابًا وملف شركة لبدء إدارة عملياتك.</p>
      <AuthSetupNotice />
      <AuthForm mode="signup" action={signUp} />
    </section>
  );
}
