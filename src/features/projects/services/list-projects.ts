import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { Project } from "@/features/projects/types";
import { buildIlikeOrFilter, readSearchValue } from "@/lib/utils/search-params";
import { getPageRange, normalizePage, normalizePageSize } from "@/lib/utils/pagination";
import type { PaginatedRows } from "@/lib/supabase/query-result";

export async function listProjects(filters: { search?: string; page?: number; pageSize?: number } = {}): Promise<QueryResult<PaginatedRows<Project>>> {
  const search = readSearchValue(filters.search);
  const page = normalizePage(filters.page);
  const pageSize = normalizePageSize(filters.pageSize);
  const { from, to } = getPageRange(page, pageSize);
  return runServerQuery(async (client) => {
    let query = client
      .from("projects")
      .select("id, company_id, name, location, description, developer_phone, created_at, updated_at", { count: "exact" });
    if (search) query = query.or(buildIlikeOrFilter(["name", "location", "description"], search));
    const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
    return { data: { rows: data ?? [], totalCount: count ?? 0, page, pageSize }, error };
  });
}

export async function countProjects(): Promise<QueryResult<number>> {
  return runServerQuery(async (client) => {
    const { count, error } = await client
      .from("projects")
      .select("id", { count: "exact", head: true });

    return { data: count ?? 0, error };
  });
}
