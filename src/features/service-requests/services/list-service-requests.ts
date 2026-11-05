import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { ServiceRequestListItem } from "@/features/service-requests/types";
import type {
  ServiceRequestStatus,
  ServiceRequestType,
} from "@/types/database";
import { buildIlikeOrFilter, readSearchValue } from "@/lib/utils/search-params";
import { getPageRange, normalizePage, normalizePageSize } from "@/lib/utils/pagination";
import type { PaginatedRows } from "@/lib/supabase/query-result";

type ServiceRequestQueryRow = {
  id: string;
  company_id: string;
  unit_id: string | null;
  request_type: ServiceRequestType;
  title: string;
  description: string | null;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at: string;
  units: { code: string } | null;
};

function toServiceRequestListItem(
  row: ServiceRequestQueryRow,
): ServiceRequestListItem {
  return {
    id: row.id,
    company_id: row.company_id,
    unit_id: row.unit_id,
    request_type: row.request_type,
    title: row.title,
    description: row.description,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    unitCode: row.units?.code ?? null,
  };
}

export async function listServiceRequests(filters: { search?: string; status?: ServiceRequestStatus; type?: ServiceRequestType; page?: number; pageSize?: number } = {}): Promise<QueryResult<PaginatedRows<ServiceRequestListItem>>> {
  const search = readSearchValue(filters.search);
  const page = normalizePage(filters.page);
  const pageSize = normalizePageSize(filters.pageSize);
  const { from, to } = getPageRange(page, pageSize);
  const result = await runServerQuery(async (client) =>
    {
      let query = client
      .from("service_requests")
      .select(
        "id, company_id, unit_id, request_type, title, description, status, created_at, updated_at, units:units!service_requests_unit_id_fkey ( code )",
        { count: "exact" },
      );
      if (search) query = query.or(buildIlikeOrFilter(["title", "description"], search));
      if (filters.status) query = query.eq("status", filters.status);
      if (filters.type) query = query.eq("request_type", filters.type);
      const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
      return { data: { rows: data ?? [], totalCount: count ?? 0, page, pageSize }, error };
    },
  );

  if (result.status !== "ok") {
    return result;
  }

  return {
    status: "ok",
    data: { ...result.data, rows: (result.data.rows as ServiceRequestQueryRow[]).map(toServiceRequestListItem) },
  };
}

export async function countOpenServiceRequests(): Promise<QueryResult<number>> {
  return runServerQuery(async (client) => {
    const { count, error } = await client
      .from("service_requests")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "in_progress"]);

    return { data: count ?? 0, error };
  });
}
