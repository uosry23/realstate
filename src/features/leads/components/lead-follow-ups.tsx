import { completeLeadFollowUp } from "@/features/leads/actions";
import type { LeadFollowUp } from "@/features/leads/types";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatDateTime } from "@/lib/format/date";

export function LeadFollowUps({ leadId, followUps, canWrite }: { leadId: string; followUps: LeadFollowUp[]; canWrite: boolean }) {
  if (followUps.length === 0) return <EmptyState title="لا توجد متابعات بعد" description="سجّل موعدًا أو ملاحظة لمتابعة هذا العميل." />;
  return <ol className="space-y-3">
    {followUps.map((followUp) => (
      <li key={followUp.id} className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="whitespace-pre-wrap text-sm text-slate-800">{followUp.note}</p>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${followUp.completed_at ? "bg-teal-50 text-teal-800" : "bg-amber-50 text-amber-800"}`}>
            {followUp.completed_at ? "مكتملة" : "مفتوحة"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
          {followUp.due_at ? <p>الموعد: {formatDate(followUp.due_at)}</p> : null}
          <p>أُضيفت: {formatDateTime(followUp.created_at)}</p>
          {followUp.completed_at ? <p>اكتملت: {formatDateTime(followUp.completed_at)}</p> : null}
        </div>
        {canWrite && !followUp.completed_at ? (
          <form action={completeLeadFollowUp} className="mt-3">
            <input type="hidden" name="lead_id" value={leadId} />
            <input type="hidden" name="follow_up_id" value={followUp.id} />
            <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-600">تسجيل اكتمال المتابعة</button>
          </form>
        ) : null}
      </li>
    ))}
  </ol>;
}
