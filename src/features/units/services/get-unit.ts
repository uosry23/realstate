import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { Unit } from "@/features/units/types";

type UnitQueryRow = Unit & { projects: { name: string } | null };

export type UnitDetail = Unit & { projectName: string | null };

export async function getUnit(id: string): Promise<QueryResult<UnitDetail>> {
  const result = await runServerQuery(async (client) => {
    const { data, error } = await client
      .from("units")
      .select("id, company_id, project_id, code, unit_type, floor, area_sqm, status, created_at, updated_at, projects:projects!units_project_id_fkey ( name )")
      .eq("id", id)
      .maybeSingle();
    return { data, error: error ?? (data ? null : { message: "الوحدة غير موجودة." }) };
  });
  if (result.status !== "ok") return result;
  const row = result.data as UnitQueryRow;
  return {
    status: "ok",
    data: { ...row, projectName: row.projects?.name ?? null },
  };
}
