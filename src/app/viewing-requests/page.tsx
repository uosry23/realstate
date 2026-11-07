import { PageHeader } from "@/components/ui/page-header";
import { PaginatedListQueryPanel } from "@/components/ui/paginated-list-query-panel";
import { LeadsTable } from "@/features/leads/components/leads-table";
import { listLeads } from "@/features/leads/services/list-leads";
import { listProjects } from "@/features/projects/services/list-projects";
import { listBrokers } from "@/features/brokers/services/list-brokers";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";
import { readSearchValue } from "@/lib/utils/search-params";

export default async function ViewingRequestsPage({ searchParams }: PageProps<"/viewing-requests">) {
  const params = await searchParams;
  const page = Math.max(1, Number(readSearchValue(params.page)) || 1);
  const [result, projectsResult, brokersResult, membership] = await Promise.all([listLeads({ source: "الموقع العام", page }), listProjects({ pageSize: 1000 }), listBrokers({ pageSize: 1000 }), getCurrentMembership()]);
  const canWrite = membership?.role === "manager" || membership?.role === "employee";
  return <section><PageHeader title="طلبات المعاينة" description="طلبات العملاء الواردة من الموقع العام." /><PaginatedListQueryPanel result={result} emptyTitle="لا توجد طلبات معاينة" emptyDescription="ستظهر هنا الطلبات الجديدة من صفحة العقارات." basePath="/viewing-requests" searchParams={{}}>{(leads) => <LeadsTable leads={leads} brokers={brokersResult.status === "ok" ? brokersResult.data.rows : []} projects={projectsResult.status === "ok" ? projectsResult.data.rows : []} canWrite={canWrite} />}</PaginatedListQueryPanel></section>;
}
