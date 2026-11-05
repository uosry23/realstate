import { PageHeader } from "@/components/ui/page-header";
import { PaginatedListQueryPanel } from "@/components/ui/paginated-list-query-panel";
import { UnitsTable } from "@/features/units/components/units-table";
import { listUnits } from "@/features/units/services/list-units";
import { listProjects } from "@/features/projects/services/list-projects";
import { CreateUnitForm } from "@/features/units/components/create-unit-form";
import { ActionNotice } from "@/components/ui/action-notice";
import { UnitFilters } from "@/features/units/components/unit-filters";
import { readSearchValue } from "@/lib/utils/search-params";
import type { UnitStatus } from "@/types/database";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";

export default async function UnitsPage({ searchParams }: PageProps<"/units">) {
  const params = await searchParams;
  const search = readSearchValue(params.search);
  const statusValue = readSearchValue(params.status);
  const statuses: UnitStatus[] = ["available", "reserved", "sold"];
  const status = statuses.includes(statusValue as UnitStatus) ? statusValue as UnitStatus : "";
  const projectIdValue = readSearchValue(params.project_id);
  const projectId = /^[0-9a-f-]{36}$/i.test(projectIdValue) ? projectIdValue : "";
  const pageValue = Number(readSearchValue(params.page));
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const [result, projectsResult, membership] = await Promise.all([listUnits({ search, status: status || undefined, projectId: projectId || undefined, page }), listProjects({ pageSize: 1000 }), getCurrentMembership()]);
  const canWrite = membership?.role === "manager" || membership?.role === "employee";

  return (
    <section>
      <PageHeader
        title="الوحدات"
        description="متابعة الوحدات وحالاتها: متاحة، محجوزة، أو مباعة."
      />
      <ActionNotice state={params.state} />
      {canWrite && projectsResult.status === "ok" ? <CreateUnitForm projects={projectsResult.data.rows} /> : null}
      <UnitFilters search={search} status={status} projectId={projectId} projects={projectsResult.status === "ok" ? projectsResult.data.rows : []} />
      <PaginatedListQueryPanel
        result={result}
        emptyTitle="لا توجد وحدات بعد"
        emptyDescription="لا توجد وحدات تطابق التصفية الحالية."
        basePath="/units"
        searchParams={{ ...(search ? { search } : {}), ...(status ? { status } : {}), ...(projectId ? { project_id: projectId } : {}) }}
      >
        {(units) => <UnitsTable units={units} canWrite={canWrite} />}
      </PaginatedListQueryPanel>
    </section>
  );
}
