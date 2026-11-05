import { PageHeader } from "@/components/ui/page-header";
import { PaginatedListQueryPanel } from "@/components/ui/paginated-list-query-panel";
import { LeadsTable } from "@/features/leads/components/leads-table";
import { listLeads } from "@/features/leads/services/list-leads";
import { listProjects } from "@/features/projects/services/list-projects";
import { listBrokers } from "@/features/brokers/services/list-brokers";
import { CreateLeadForm } from "@/features/leads/components/create-lead-form";
import { ActionNotice } from "@/components/ui/action-notice";
import { LeadFilters } from "@/features/leads/components/lead-filters";
import { readSearchValue } from "@/lib/utils/search-params";
import type { LeadStage } from "@/types/database";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";

export default async function LeadsPage({ searchParams }: PageProps<"/leads">) {
  const params = await searchParams;
  const search = readSearchValue(params.search);
  const stageValue = readSearchValue(params.stage);
  const stages: LeadStage[] = ["new", "follow_up", "viewing", "negotiation", "won", "lost"];
  const stage = stages.includes(stageValue as LeadStage) ? stageValue as LeadStage : "";
  const pageValue = Number(readSearchValue(params.page));
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const [result, projectsResult, brokersResult, membership] = await Promise.all([listLeads({ search, stage: stage || undefined, page }), listProjects({ pageSize: 1000 }), listBrokers({ pageSize: 1000 }), getCurrentMembership()]);
  const canWrite = membership?.role === "manager" || membership?.role === "employee";

  return (
    <section>
      <PageHeader
        title="العملاء المحتملون"
        description="متابعة العملاء وتوزيعهم على الوسطاء حسب مراحل البيع."
      />
      <ActionNotice state={params.state} />
      {canWrite && projectsResult.status === "ok" && brokersResult.status === "ok" ? <CreateLeadForm projects={projectsResult.data.rows} brokers={brokersResult.data.rows} /> : null}
      <LeadFilters search={search} stage={stage} />
      <PaginatedListQueryPanel
        result={result}
        emptyTitle="لا يوجد عملاء محتملون بعد"
        emptyDescription="لا يوجد عملاء يطابقون التصفية الحالية."
        basePath="/leads"
        searchParams={{ ...(search ? { search } : {}), ...(stage ? { stage } : {}) }}
      >
        {(leads) => <LeadsTable leads={leads} brokers={brokersResult.status === "ok" ? brokersResult.data.rows : []} projects={projectsResult.status === "ok" ? projectsResult.data.rows : []} canWrite={canWrite} />}
      </PaginatedListQueryPanel>
    </section>
  );
}
