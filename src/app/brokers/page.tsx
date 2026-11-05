import { PageHeader } from "@/components/ui/page-header";
import { PaginatedListQueryPanel } from "@/components/ui/paginated-list-query-panel";
import { BrokersTable } from "@/features/brokers/components/brokers-table";
import { listBrokers } from "@/features/brokers/services/list-brokers";
import { CreateBrokerForm } from "@/features/brokers/components/create-broker-form";
import { ActionNotice } from "@/components/ui/action-notice";
import { BrokerFilters } from "@/features/brokers/components/broker-filters";
import { readSearchValue } from "@/lib/utils/search-params";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";

export default async function BrokersPage({ searchParams }: PageProps<"/brokers">) {
  const params = await searchParams;
  const search = readSearchValue(params.search);
  const activeValue = readSearchValue(params.active);
  const active = activeValue === "true" ? true : activeValue === "false" ? false : undefined;
  const pageValue = Number(readSearchValue(params.page));
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const [result, membership] = await Promise.all([listBrokers({ search, active, page }), getCurrentMembership()]);
  const canWrite = membership?.role === "manager" || membership?.role === "employee";

  return (
    <section>
      <PageHeader
        title="الوسطاء"
        description="إدارة الوسطاء المرتبطين بتوزيع العملاء المحتملين."
      />
      <ActionNotice state={params.state} />
      {canWrite ? <CreateBrokerForm /> : null}
      <BrokerFilters search={search} active={activeValue === "true" || activeValue === "false" ? activeValue : ""} />
      <PaginatedListQueryPanel
        result={result}
        emptyTitle="لا يوجد وسطاء بعد"
        emptyDescription="لا يوجد وسطاء يطابقون التصفية الحالية."
        basePath="/brokers"
        searchParams={{ ...(search ? { search } : {}), ...(active !== undefined ? { active: String(active) } : {}) }}
      >
        {(brokers) => <BrokersTable brokers={brokers} canWrite={canWrite} />}
      </PaginatedListQueryPanel>
    </section>
  );
}
