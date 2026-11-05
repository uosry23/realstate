import { redirect } from "next/navigation";
import { ActionNotice } from "@/components/ui/action-notice";
import { ErrorState } from "@/components/ui/error-state";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { CompanyInvitationForm } from "@/features/team/components/company-invitation-form";
import { CompanyInvitationsList } from "@/features/team/components/company-invitations-list";
import { CompanyMembersTable } from "@/features/team/components/company-members-table";
import { listCompanyTeam } from "@/features/team/services/list-company-members";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";
import { readSupabasePublicEnv } from "@/lib/supabase/env";

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ state?: string | string[] }> }) {
  const params = await searchParams;
  if (!readSupabasePublicEnv()) {
    return <section><PageHeader title="أعضاء الشركة" description="إدارة أعضاء الشركة وأدوارهم." /><SetupNotice /></section>;
  }

  const membership = await getCurrentMembership();
  if (!membership) redirect("/login");
  if (membership.role !== "manager") redirect("/");

  const team = await listCompanyTeam();
  return <section>
    <PageHeader title="أعضاء الشركة" description="إدارة العضوية والدعوات وأدوار الوصول إلى بيانات الشركة." />
    <ActionNotice state={params.state} />
    <CompanyInvitationForm />
    {team.status === "error" ? <ErrorState message={team.message} /> : null}
    {team.status === "ok" ? <>
      <section className="mb-8 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">أعضاء الشركة ({team.data.members.length})</h2>
        <CompanyMembersTable members={team.data.members} currentUserId={membership.userId} />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">الدعوات ({team.data.invitations.length})</h2>
        <CompanyInvitationsList invitations={team.data.invitations} />
      </section>
    </> : null}
  </section>;
}
