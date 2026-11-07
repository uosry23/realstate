import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { UnitListItem } from "@/features/units/types";
import type { UnitStatus } from "@/types/database";
import { buildIlikeOrFilter, readSearchValue } from "@/lib/utils/search-params";
import { getPageRange, normalizePage, normalizePageSize } from "@/lib/utils/pagination";
import type { PaginatedRows } from "@/lib/supabase/query-result";

type UnitQueryRow = {
  id: string;
  company_id: string;
  project_id: string;
  code: string;
  unit_type: string | null;
  floor: string | null;
  area_sqm: number | null;
  image_url: string | null;
  status: UnitStatus;
  created_at: string;
  updated_at: string;
  projects: { name: string } | null;
};

function toUnitListItem(row: UnitQueryRow): UnitListItem {
  return {
    id: row.id,
    company_id: row.company_id,
    project_id: row.project_id,
    code: row.code,
    unit_type: row.unit_type,
    floor: row.floor,
    area_sqm: row.area_sqm,
    image_url: row.image_url,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    projectName: row.projects?.name ?? null,
  };
}

export async function listUnits(filters: { search?: string; status?: UnitStatus; projectId?: string; page?: number; pageSize?: number } = {}): Promise<QueryResult<PaginatedRows<UnitListItem>>> {
  const search = readSearchValue(filters.search);
  const page = normalizePage(filters.page);
  const pageSize = normalizePageSize(filters.pageSize);
  const { from, to } = getPageRange(page, pageSize);
  const result = await runServerQuery(async (client) =>
    {
      let query = client
      .from("units")
      .select(
        "id, company_id, project_id, code, unit_type, floor, area_sqm, image_url, status, created_at, updated_at, projects:projects!units_project_id_fkey ( name )",
        { count: "exact" },
      );
      if (search) query = query.or(buildIlikeOrFilter(["code", "unit_type", "floor"], search));
      if (filters.status) query = query.eq("status", filters.status);
      if (filters.projectId) query = query.eq("project_id", filters.projectId);
      const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
      return { data: { rows: data ?? [], totalCount: count ?? 0, page, pageSize }, error };
    },
  );

  if (result.status !== "ok") {
    return result;
  }

  return {
    status: "ok",
    data: { ...result.data, rows: (result.data.rows as UnitQueryRow[]).map(toUnitListItem) },
  };
}

export async function countUnits(): Promise<QueryResult<number>> {
  return runServerQuery(async (client) => {
    const { count, error } = await client
      .from("units")
      .select("id", { count: "exact", head: true });

    return { data: count ?? 0, error };
  });
}

export async function countUnitsByStatus(): Promise<
  QueryResult<Record<UnitStatus, number>>
> {
  const result = await runServerQuery(async (client) =>
    {
      const [available, reserved, sold] = await Promise.all([
        client.from("units").select("id", { count: "exact", head: true }).eq("status", "available"),
        client.from("units").select("id", { count: "exact", head: true }).eq("status", "reserved"),
        client.from("units").select("id", { count: "exact", head: true }).eq("status", "sold"),
      ]);
      const error = available.error ?? reserved.error ?? sold.error;
      if (error) return { data: null, error };
      return {
        data: {
          available: available.count ?? 0,
          reserved: reserved.count ?? 0,
          sold: sold.count ?? 0,
        },
        error: null,
      };
    },
  );

  if (result.status !== "ok") {
    return result;
  }
  return { status: "ok", data: result.data };
}
