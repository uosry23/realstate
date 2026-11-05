"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentWritableCompanyId } from "@/lib/auth/get-current-company-id";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createBroker(formData: FormData) {
  const fullName = formData.get("full_name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof fullName !== "string" || fullName.trim().length < 2 || (typeof email === "string" && email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))) redirect("/brokers?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/brokers?state=error");
  const { error } = await supabase.from("brokers").insert({
    company_id: companyId,
    full_name: fullName.trim(),
    phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
    email: typeof email === "string" && email.trim() ? email.trim() : null,
  });
  if (error) redirect("/brokers?state=error");
  revalidatePath("/brokers");
  redirect("/brokers?state=created");
}

export async function updateBroker(formData: FormData) {
  const brokerId = formData.get("broker_id");
  const fullName = formData.get("full_name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const activeValue = formData.get("is_active");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof brokerId !== "string" || !/^[0-9a-f-]{36}$/i.test(brokerId) || typeof fullName !== "string" || fullName.trim().length < 2 || (typeof email === "string" && email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))) redirect("/brokers?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/brokers?state=error");
  const { data, error } = await supabase.from("brokers").update({
    full_name: fullName.trim(),
    phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
    email: typeof email === "string" && email.trim() ? email.trim() : null,
    is_active: activeValue === "true",
  }).eq("id", brokerId).eq("company_id", companyId).select("id").maybeSingle();
  if (error || !data) redirect("/brokers?state=error");
  revalidatePath("/brokers");
  revalidatePath("/leads");
  redirect("/brokers?state=created");
}
