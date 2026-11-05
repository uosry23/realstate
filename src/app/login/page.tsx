import { signIn } from "@/app/auth-actions";
import { AuthSetupNotice } from "@/components/auth/auth-setup-notice";
import { AuthForm } from "@/components/auth/auth-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ authError?: string }> }) {
  const { authError } = await searchParams;
  return (
    <section className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold text-slate-900">تسجيل الدخول</h1>
      <p className="mb-6 mt-2 text-sm text-slate-600">سجّل الدخول لمتابعة عمليات شركتك العقارية.</p>
      <AuthSetupNotice />
      {authError === "invalid-link" ? <p role="alert" className="mb-4 text-sm text-rose-700">الرابط غير صالح أو انتهت صلاحيته. اطلب رسالة جديدة ثم حاول مرة أخرى.</p> : null}
      <AuthForm mode="login" action={signIn} />
    </section>
  );
}
