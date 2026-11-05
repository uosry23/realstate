import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { UNIT_STATUS_LABELS } from "@/features/units/types";
import type { UnitStatusEvent } from "@/features/units/types";
import { formatDateTime } from "@/lib/format/date";

export function UnitStatusHistory({ events }: { events: UnitStatusEvent[] }) {
  if (events.length === 0) return <EmptyState title="لا يوجد سجل للحالة" description="ستظهر هنا انتقالات الحالة بعد تسجيلها." />;
  return <ol className="space-y-3">
    {events.map((event) => (
      <li key={event.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {event.from_status ? <><StatusBadge label={UNIT_STATUS_LABELS[event.from_status]} tone={event.from_status} /><span aria-hidden="true">←</span></> : <span className="text-slate-500">حالة التسجيل</span>}
          <StatusBadge label={UNIT_STATUS_LABELS[event.to_status]} tone={event.to_status} />
        </div>
        <time className="text-xs text-slate-500" dateTime={event.changed_at}>{formatDateTime(event.changed_at)}</time>
        {event.note ? <p className="w-full text-sm text-slate-700">{event.note}</p> : null}
      </li>
    ))}
  </ol>;
}
