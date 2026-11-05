import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CompanyRole } from "@/types/database";

export type CompanyMembership = {
  userId: string;
  companyId: string;
  fullName: string;
  role: CompanyRole;
};

export async function getCurrentMembership(): Promise<CompanyMembership | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("company_id, full_name, role")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (error || !profile) return null;

  return {
    userId: userData.user.id,
    companyId: profile.company_id,
    fullName: profile.full_name,
    role: profile.role,
  };
}
