"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CompanyRole } from "@/types/database";

const companyRoles: CompanyRole[] = ["manager", "employee", "viewer"];

export type InvitationActionState = {
  error?: string;
  invitationCode?: string;
  invitedEmail?: string;
};

export async function createCompanyInvitation(
  _previousState: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  const membership = await getCurrentMembership();
  if (!membership || membership.role !== "manager") return { error: "إدارة أعضاء الشركة متاحة للمدير فقط." };

  const emailValue = formData.get("email");
  const roleValue = formData.get("role");
  if (typeof emailValue !== "string" || !/^\S+@\S+\.\S+$/.test(emailValue.trim())) {
    return { error: "أدخل بريدًا إلكترونيًا صحيحًا." };
  }
  if (typeof roleValue !== "string" || !companyRoles.includes(roleValue as CompanyRole)) {
    return { error: "اختر دورًا صالحًا للعضو." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "إعداد الاتصال بقاعدة البيانات غير مكتمل." };

  const invitedEmail = emailValue.trim().toLowerCase();
  const now = new Date();
  await supabase
    .from("company_invitations")
    .update({ revoked_at: now.toISOString() })
    .eq("company_id", membership.companyId)
    .eq("invited_email", invitedEmail)
    .is("accepted_at", null)
    .is("revoked_at", null)
    .lt("expires_at", now.toISOString());

  const invitationCode = randomBytes(32).toString("base64url");
  const { error } = await supabase.from("company_invitations").insert({
    company_id: membership.companyId,
    invited_email: invitedEmail,
    role: roleValue as CompanyRole,
    token_hash: createHash("sha256").update(invitationCode).digest("hex"),
    created_by: membership.userId,
    expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });
  if (error) return { error: "تعذر إنشاء الدعوة. تحقق من الدعوات المعلقة وحاول مرة أخرى." };

  revalidatePath("/team");
  return { invitationCode, invitedEmail };
}

export async function updateMemberRole(formData: FormData) {
  const membership = await getCurrentMembership();
  if (!membership || membership.role !== "manager") redirect("/team?state=error");
  const memberId = formData.get("member_id");
  const roleValue = formData.get("role");
  if (typeof memberId !== "string" || !/^[0-9a-f-]{36}$/i.test(memberId) || typeof roleValue !== "string" || !companyRoles.includes(roleValue as CompanyRole)) redirect("/team?state=error");

  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/team?state=error");
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: roleValue as CompanyRole })
    .eq("id", memberId)
    .eq("company_id", membership.companyId)
    .select("id")
    .maybeSingle();
  if (error || !data) redirect("/team?state=error");
  revalidatePath("/");
  revalidatePath("/team");
  redirect("/team?state=updated");
}

export async function revokeCompanyInvitation(formData: FormData) {
  const membership = await getCurrentMembership();
  if (!membership || membership.role !== "manager") redirect("/team?state=error");
  const invitationId = formData.get("invitation_id");
  if (typeof invitationId !== "string" || !/^[0-9a-f-]{36}$/i.test(invitationId)) redirect("/team?state=error");

  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/team?state=error");
  const { data, error } = await supabase
    .from("company_invitations")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", invitationId)
    .eq("company_id", membership.companyId)
    .is("accepted_at", null)
    .is("revoked_at", null)
    .select("id")
    .maybeSingle();
  if (error || !data) redirect("/team?state=error");
  revalidatePath("/team");
  redirect("/team?state=updated");
}
