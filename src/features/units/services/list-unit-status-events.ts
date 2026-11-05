import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";
import type { UnitStatusEvent } from "@/features/units/types";

export async function listUnitStatusEvents(unitId: string): Promise<QueryResult<UnitStatusEvent[]>> {
  return runServerQuery(async (client) =>
    client
      .from("unit_status_events")
      .select("id, company_id, unit_id, from_status, to_status, changed_by, changed_at, note")
      .eq("unit_id", unitId)
      .order("changed_at", { ascending: false }),
  );
}
