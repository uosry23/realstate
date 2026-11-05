import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { Broker } from "@/features/brokers/types";
import { buildIlikeOrFilter, readSearchValue } from "@/lib/utils/search-params";
import { getPageRange, normalizePage, normalizePageSize } from "@/lib/utils/pagination";
import type { PaginatedRows } from "@/lib/supabase/query-result";

export async function listBrokers(filters: { search?: string; active?: boolean; page?: number; pageSize?: number } = {}): Promise<QueryResult<PaginatedRows<Broker>>> {
  const search = readSearchValue(filters.search);
  const page = normalizePage(filters.page);
  const pageSize = normalizePageSize(filters.pageSize);
  const { from, to } = getPageRange(page, pageSize);
  return runServerQuery(async (client) => {
    let query = client
      .from("brokers")
      .select(
        "id, company_id, full_name, phone, email, is_active, created_at, updated_at",
        { count: "exact" },
      );
    if (search) query = query.or(buildIlikeOrFilter(["full_name", "phone", "email"], search));
    if (typeof filters.active === "boolean") query = query.eq("is_active", filters.active);
    const { data, count, error } = await query.order("full_name", { ascending: true }).range(from, to);
    return { data: { rows: data ?? [], totalCount: count ?? 0, page, pageSize }, error };
  });
}

export async function countBrokers(): Promise<QueryResult<number>> {
  return runServerQuery(async (client) => {
    const { count, error } = await client
      .from("brokers")
      .select("id", { count: "exact", head: true });

    return { data: count ?? 0, error };
  });
}
