import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { LeadListItem } from "@/features/leads/types";
import type { LeadStage } from "@/types/database";

type LeadQueryRow = {
  id: string;
  company_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  stage: LeadStage;
  assigned_broker_id: string | null;
  interested_project_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  brokers: { full_name: string } | null;
  projects: { name: string } | null;
};

export async function getLead(id: string): Promise<QueryResult<LeadListItem>> {
  const result = await runServerQuery(async (client) => {
    const { data, error } = await client
      .from("leads")
      .select("id, company_id, full_name, phone, email, source, stage, assigned_broker_id, interested_project_id, notes, created_at, updated_at, brokers:brokers!leads_assigned_broker_id_fkey ( full_name ), projects:projects!leads_interested_project_id_fkey ( name )")
      .eq("id", id)
      .maybeSingle();
    return { data, error: error ?? (data ? null : { message: "العميل غير موجود." }) };
  });
  if (result.status !== "ok") return result;
  const row = result.data as LeadQueryRow;
  return {
    status: "ok",
    data: {
      ...row,
      assignedBrokerName: row.brokers?.full_name ?? null,
      interestedProjectName: row.projects?.name ?? null,
    },
  };
}
