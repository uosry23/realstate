import { UNIT_STATUS_LABELS } from "@/features/units/types";
import type { OperationalSummary } from "@/features/dashboard/types";
import Link from "next/link";

type OperationalSummaryCardsProps = {
  summary: OperationalSummary;
};

export function OperationalSummaryCards({
  summary,
}: OperationalSummaryCardsProps) {
  const cards = [
    { label: "المشاريع", value: summary.projectCount },
    { label: "الوحدات", value: summary.unitCount },
    {
      label: UNIT_STATUS_LABELS.available,
      value: summary.unitCountsByStatus.available,
    },
    {
      label: UNIT_STATUS_LABELS.reserved,
      value: summary.unitCountsByStatus.reserved,
    },
    { label: UNIT_STATUS_LABELS.sold, value: summary.unitCountsByStatus.sold },
    { label: "العملاء المحتملون", value: summary.leadCount },
    { label: "طلبات معاينة الموقع", value: summary.publicInterestLeadCount, href: "/viewing-requests" },
    { label: "الوسطاء", value: summary.brokerCount },
    { label: "طلبات مفتوحة", value: summary.openServiceRequestCount },
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <li
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          {card.href ? <Link href={card.href} className="block rounded outline-none focus-visible:ring-2 focus-visible:ring-teal-600"><p className="text-sm text-slate-600">{card.label}</p><p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p></Link> : <><p className="text-sm text-slate-600">{card.label}</p><p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p></>}
        </li>
      ))}
    </ul>
  );
}
