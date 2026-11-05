import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { CompanyInvitation, CompanyMember } from "@/features/team/types";

export type CompanyTeam = {
  members: CompanyMember[];
  invitations: CompanyInvitation[];
};

export async function listCompanyTeam(): Promise<QueryResult<CompanyTeam>> {
  return runServerQuery(async (client) => {
    const [membersResult, invitationsResult] = await Promise.all([
      client.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: true }),
      client.from("company_invitations").select("id, invited_email, role, expires_at, accepted_at, revoked_at, created_at").order("created_at", { ascending: false }),
    ]);
    const error = membersResult.error ?? invitationsResult.error;
    if (error) return { data: null, error };
    return {
      data: {
        members: membersResult.data ?? [],
        invitations: invitationsResult.data ?? [],
      },
      error: null,
    };
  });
}
