import { PageHeader } from "@/components/ui/page-header";
import { PaginatedListQueryPanel } from "@/components/ui/paginated-list-query-panel";
import { ProjectsTable } from "@/features/projects/components/projects-table";
import { listProjects } from "@/features/projects/services/list-projects";
import { CreateProjectForm } from "@/features/projects/components/create-project-form";
import { ActionNotice } from "@/components/ui/action-notice";
import { ProjectFilters } from "@/features/projects/components/project-filters";
import { readSearchValue } from "@/lib/utils/search-params";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const params = await searchParams;
  const search = readSearchValue(params.search);
  const pageValue = Number(readSearchValue(params.page));
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const [result, membership] = await Promise.all([listProjects({ search, page }), getCurrentMembership()]);
  const canWrite = membership?.role === "manager" || membership?.role === "employee";

  return (
    <section>
      <PageHeader
        title="المشاريع"
        description="عرض المشاريع العقارية التابعة للشركة."
      />
      <ActionNotice state={params.state} />
      {canWrite ? <CreateProjectForm /> : null}
      <ProjectFilters search={search} />
      <PaginatedListQueryPanel
        result={result}
        emptyTitle="لا توجد مشاريع بعد"
        emptyDescription="لا توجد مشاريع تطابق التصفية الحالية."
        basePath="/projects"
        searchParams={search ? { search } : {}}
      >
        {(projects) => <ProjectsTable projects={projects} canWrite={canWrite} />}
      </PaginatedListQueryPanel>
    </section>
  );
}
