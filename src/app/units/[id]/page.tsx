import Link from "next/link";
import { notFound } from "next/navigation";
import { ErrorState } from "@/components/ui/error-state";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { StatusBadge } from "@/components/ui/status-badge";
import { UNIT_STATUS_LABELS } from "@/features/units/types";
import { getUnit } from "@/features/units/services/get-unit";
import { listUnitStatusEvents } from "@/features/units/services/list-unit-status-events";
import { UnitStatusHistory } from "@/features/units/components/unit-status-history";

export default async function UnitDetailPage({ params }: PageProps<"/units/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [unitResult, historyResult] = await Promise.all([getUnit(id), listUnitStatusEvents(id)]);
  if (unitResult.status === "unconfigured" || historyResult.status === "unconfigured") return <SetupNotice />;
  if (unitResult.status === "error") return <ErrorState message={unitResult.message} />;
  if (historyResult.status === "error") return <ErrorState message={historyResult.message} />;
  const unit = unitResult.data;

  return <section>
    <Link href="/units" className="mb-4 inline-flex rounded text-sm text-teal-800 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-teal-600">العودة إلى الوحدات</Link>
    <PageHeader title={`الوحدة ${unit.code}`} description={unit.projectName ?? "الوحدة العقارية"} />
    <dl className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
      <div><dt className="text-slate-500">الحالة الحالية</dt><dd className="mt-1"><StatusBadge label={UNIT_STATUS_LABELS[unit.status]} tone={unit.status} /></dd></div>
      <div><dt className="text-slate-500">نوع الوحدة</dt><dd className="mt-1 text-slate-900">{unit.unit_type ?? "—"}</dd></div>
      <div><dt className="text-slate-500">الدور</dt><dd className="mt-1 text-slate-900">{unit.floor ?? "—"}</dd></div>
      <div><dt className="text-slate-500">المساحة</dt><dd className="mt-1 text-slate-900">{unit.area_sqm ? `${unit.area_sqm} م²` : "—"}</dd></div>
    </dl>
    <h2 className="mb-3 text-lg font-semibold text-slate-900">سجل تغييرات الحالة</h2>
    <UnitStatusHistory events={historyResult.data} />
  </section>;
}
