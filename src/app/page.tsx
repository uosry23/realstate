import { OperationalSummaryCards } from "@/features/dashboard/components/operational-summary-cards";
import { getOperationalSummary } from "@/features/dashboard/services/get-operational-summary";
import { ErrorState } from "@/components/ui/error-state";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";

export default async function HomePage() {
  const summary = await getOperationalSummary();

  return (
    <section>
      <PageHeader
        title="العقار"
        description="متابعة المشاريع والوحدات والعملاء والوسطاء وطلبات ما بعد البيع والصيانة."
      />
      {summary.status === "unconfigured" ? <SetupNotice /> : null}
      {summary.status === "error" ? (
        <ErrorState message={summary.message} />
      ) : null}
      {summary.status === "ok" ? (
        <OperationalSummaryCards summary={summary.data} />
      ) : null}
    </section>
  );
}
