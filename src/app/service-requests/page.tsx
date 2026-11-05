import { PageHeader } from "@/components/ui/page-header";
import { PaginatedListQueryPanel } from "@/components/ui/paginated-list-query-panel";
import { ServiceRequestsTable } from "@/features/service-requests/components/service-requests-table";
import { listServiceRequests } from "@/features/service-requests/services/list-service-requests";
import { listUnits } from "@/features/units/services/list-units";
import { CreateServiceRequestForm } from "@/features/service-requests/components/create-service-request-form";
import { ActionNotice } from "@/components/ui/action-notice";
import { ServiceRequestFilters } from "@/features/service-requests/components/service-request-filters";
import { readSearchValue } from "@/lib/utils/search-params";
import type { ServiceRequestStatus, ServiceRequestType } from "@/types/database";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";

export default async function ServiceRequestsPage({ searchParams }: PageProps<"/service-requests">) {
  const params = await searchParams;
  const search = readSearchValue(params.search);
  const statusValue = readSearchValue(params.status);
  const statuses: ServiceRequestStatus[] = ["open", "in_progress", "resolved", "closed"];
  const status = statuses.includes(statusValue as ServiceRequestStatus) ? statusValue as ServiceRequestStatus : "";
  const typeValue = readSearchValue(params.type);
  const types: ServiceRequestType[] = ["after_sales", "maintenance"];
  const type = types.includes(typeValue as ServiceRequestType) ? typeValue as ServiceRequestType : "";
  const pageValue = Number(readSearchValue(params.page));
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const [result, unitsResult, membership] = await Promise.all([listServiceRequests({ search, status: status || undefined, type: type || undefined, page }), listUnits({ pageSize: 1000 }), getCurrentMembership()]);
  const canWrite = membership?.role === "manager" || membership?.role === "employee";

  return (
    <section>
      <PageHeader
        title="طلبات الخدمة"
        description="متابعة طلبات ما بعد البيع وشكاوى الصيانة."
      />
      <ActionNotice state={params.state} />
      {canWrite && unitsResult.status === "ok" ? <CreateServiceRequestForm units={unitsResult.data.rows} /> : null}
      <ServiceRequestFilters search={search} status={status} type={type} />
      <PaginatedListQueryPanel
        result={result}
        emptyTitle="لا توجد طلبات خدمة بعد"
        emptyDescription="لا توجد طلبات تطابق التصفية الحالية."
        basePath="/service-requests"
        searchParams={{ ...(search ? { search } : {}), ...(status ? { status } : {}), ...(type ? { type } : {}) }}
      >
        {(serviceRequests) => (
          <ServiceRequestsTable serviceRequests={serviceRequests} units={unitsResult.status === "ok" ? unitsResult.data.rows : []} canWrite={canWrite} />
        )}
      </PaginatedListQueryPanel>
    </section>
  );
}
