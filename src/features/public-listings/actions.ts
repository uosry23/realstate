"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createPublicUnitInterest(formData: FormData) {
  const unitId = formData.get("unit_id");
  const fullName = formData.get("full_name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const message = formData.get("message");
  const path = typeof unitId === "string" ? `/properties/${unitId}` : "/";
  if (typeof unitId !== "string" || !/^[0-9a-f-]{36}$/i.test(unitId) || typeof fullName !== "string" || fullName.trim().length < 2 || typeof phone !== "string" || phone.trim().length < 6 || (typeof email === "string" && email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))) redirect(`${path}?state=error`);
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect(`${path}?state=error`);
  const { error } = await supabase.rpc("create_public_unit_interest", { p_unit_id: unitId, p_full_name: fullName.trim(), p_phone: phone.trim(), p_email: typeof email === "string" ? email.trim() || null : null, p_message: typeof message === "string" ? message.trim() || null : null });
  redirect(`${path}?state=${error ? "error" : "interested"}`);
}
