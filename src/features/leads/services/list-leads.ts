import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { LeadListItem } from "@/features/leads/types";
import type { LeadStage } from "@/types/database";
import { buildIlikeOrFilter, readSearchValue } from "@/lib/utils/search-params";
import { getPageRange, normalizePage, normalizePageSize } from "@/lib/utils/pagination";
import type { PaginatedRows } from "@/lib/supabase/query-result";

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

function toLeadListItem(row: LeadQueryRow): LeadListItem {
  return {
    id: row.id,
    company_id: row.company_id,
    full_name: row.full_name,
    phone: row.phone,
    email: row.email,
    source: row.source,
    stage: row.stage,
    assigned_broker_id: row.assigned_broker_id,
    interested_project_id: row.interested_project_id,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    assignedBrokerName: row.brokers?.full_name ?? null,
    interestedProjectName: row.projects?.name ?? null,
  };
}

export async function listLeads(filters: { search?: string; stage?: LeadStage; page?: number; pageSize?: number } = {}): Promise<QueryResult<PaginatedRows<LeadListItem>>> {
  const search = readSearchValue(filters.search);
  const page = normalizePage(filters.page);
  const pageSize = normalizePageSize(filters.pageSize);
  const { from, to } = getPageRange(page, pageSize);
  const result = await runServerQuery(async (client) =>
    {
      let query = client
      .from("leads")
      .select(
        "id, company_id, full_name, phone, email, source, stage, assigned_broker_id, interested_project_id, notes, created_at, updated_at, brokers:brokers!leads_assigned_broker_id_fkey ( full_name ), projects:projects!leads_interested_project_id_fkey ( name )",
        { count: "exact" },
      );
      if (search) query = query.or(buildIlikeOrFilter(["full_name", "phone", "email"], search));
      if (filters.stage) query = query.eq("stage", filters.stage);
      const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
      return { data: { rows: data ?? [], totalCount: count ?? 0, page, pageSize }, error };
    },
  );

  if (result.status !== "ok") {
    return result;
  }

  return {
    status: "ok",
    data: { ...result.data, rows: (result.data.rows as LeadQueryRow[]).map(toLeadListItem) },
  };
}

export async function countLeads(): Promise<QueryResult<number>> {
  return runServerQuery(async (client) => {
    const { count, error } = await client
      .from("leads")
      .select("id", { count: "exact", head: true });

    return { data: count ?? 0, error };
  });
}
