import { countBrokers } from "@/features/brokers/services/list-brokers";
import type { OperationalSummary } from "@/features/dashboard/types";
import { countLeads } from "@/features/leads/services/list-leads";
import { countProjects } from "@/features/projects/services/list-projects";
import { countOpenServiceRequests } from "@/features/service-requests/services/list-service-requests";
import {
  countUnits,
  countUnitsByStatus,
} from "@/features/units/services/list-units";
import type { QueryResult } from "@/lib/supabase/query-result";

function firstFailure(
  results: Array<QueryResult<unknown>>,
): QueryResult<unknown> | null {
  return results.find((result) => result.status !== "ok") ?? null;
}

export async function getOperationalSummary(): Promise<
  QueryResult<OperationalSummary>
> {
  const [
    projects,
    units,
    unitsByStatus,
    leads,
    brokers,
    openServiceRequests,
  ] = await Promise.all([
    countProjects(),
    countUnits(),
    countUnitsByStatus(),
    countLeads(),
    countBrokers(),
    countOpenServiceRequests(),
  ]);

  const failed = firstFailure([
    projects,
    units,
    unitsByStatus,
    leads,
    brokers,
    openServiceRequests,
  ]);

  if (failed && failed.status !== "ok") {
    return failed;
  }

  if (
    projects.status !== "ok" ||
    units.status !== "ok" ||
    unitsByStatus.status !== "ok" ||
    leads.status !== "ok" ||
    brokers.status !== "ok" ||
    openServiceRequests.status !== "ok"
  ) {
    return { status: "error", message: "تعذر تجميع ملخص التشغيل." };
  }

  return {
    status: "ok",
    data: {
      projectCount: projects.data,
      unitCount: units.data,
      unitCountsByStatus: unitsByStatus.data,
      leadCount: leads.data,
      brokerCount: brokers.data,
      openServiceRequestCount: openServiceRequests.data,
    },
  };
}
