"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = { error?: string; message?: string };

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return { error: "أدخل بريدًا إلكترونيًا صحيحًا." };
  }
  if (typeof password !== "string" || password.length < 8) {
    return { error: "كلمة المرور غير صحيحة." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "إعداد الاتصال بقاعدة البيانات غير مكتمل." };
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return { error: "تعذر تسجيل الدخول. راجع البريد وكلمة المرور." };
  redirect("/");
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = formData.get("full_name");
  const companyName = formData.get("company_name");
  const email = formData.get("email");
  const password = formData.get("password");
  const invitationCodeValue = formData.get("invitation_code");
  const invitationCode = typeof invitationCodeValue === "string" ? invitationCodeValue.trim() : "";
  const companyNameText = typeof companyName === "string" ? companyName.trim() : "";
  if (typeof fullName !== "string" || fullName.trim().length < 2) {
    return { error: "أدخل اسمًا من حرفين على الأقل." };
  }
  if (invitationCode && !/^[A-Za-z0-9_-]{43}$/.test(invitationCode)) {
    return { error: "رمز الدعوة غير صالح." };
  }
  if (!invitationCode && companyNameText.length < 2) {
    return { error: "أدخل اسم الشركة." };
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return { error: "أدخل بريدًا إلكترونيًا صحيحًا." };
  }
  if (typeof password !== "string" || password.length < 8) {
    return { error: "يجب ألا تقل كلمة المرور عن 8 أحرف." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "إعداد الاتصال بقاعدة البيانات غير مكتمل." };
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        ...(invitationCode
          ? { invitation_code: invitationCode }
          : { company_name: companyNameText }),
      },
      emailRedirectTo: `${appUrl()}/auth/confirm`,
    },
  });
  if (error || !data.user) {
    return { error: "تعذر إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى." };
  }
  if (!data.session) {
    return { message: "تم إنشاء الحساب. افتح رسالة التأكيد في بريدك لإكمال التسجيل." };
  }
  redirect("/");
}

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return { error: "أدخل بريدًا إلكترونيًا صحيحًا." };
  }
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "إعداد الاتصال بقاعدة البيانات غير مكتمل." };
  await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${appUrl()}/auth/confirm?next=/reset-password`,
  });
  return { message: "إذا كان البريد مسجلًا، فستصلك رسالة برابط إعادة تعيين كلمة المرور." };
}

export async function updatePassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = formData.get("password");
  const confirmation = formData.get("password_confirmation");
  if (typeof password !== "string" || password.length < 8) {
    return { error: "يجب ألا تقل كلمة المرور عن 8 أحرف." };
  }
  if (password !== confirmation) return { error: "كلمتا المرور غير متطابقتين." };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "إعداد الاتصال بقاعدة البيانات غير مكتمل." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "انتهت صلاحية رابط إعادة التعيين. اطلب رابطًا جديدًا." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "تعذر تحديث كلمة المرور. اطلب رابطًا جديدًا وحاول مرة أخرى." };
  redirect("/");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/login");
}
