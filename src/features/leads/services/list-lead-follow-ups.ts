import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { LeadFollowUp } from "@/features/leads/types";

export async function listLeadFollowUps(leadId: string): Promise<QueryResult<LeadFollowUp[]>> {
  return runServerQuery(async (client) =>
    client
      .from("lead_follow_ups")
      .select("id, company_id, lead_id, note, due_at, completed_at, created_by, created_at, updated_at")
      .eq("lead_id", leadId)
      .order("due_at", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false }),
  );
}
