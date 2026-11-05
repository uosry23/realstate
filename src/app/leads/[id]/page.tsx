import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionNotice } from "@/components/ui/action-notice";
import { ErrorState } from "@/components/ui/error-state";
import { PageHeader } from "@/components/ui/page-header";
import { SetupNotice } from "@/components/ui/setup-notice";
import { CreateFollowUpForm } from "@/features/leads/components/create-follow-up-form";
import { LeadFollowUps } from "@/features/leads/components/lead-follow-ups";
import { LEAD_STAGE_LABELS } from "@/features/leads/types";
import { getLead } from "@/features/leads/services/get-lead";
import { listLeadFollowUps } from "@/features/leads/services/list-lead-follow-ups";
import { formatDateTime } from "@/lib/format/date";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ state?: string | string[] }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [leadResult, followUpsResult, membership] = await Promise.all([getLead(id), listLeadFollowUps(id), getCurrentMembership()]);
  if (leadResult.status === "unconfigured" || followUpsResult.status === "unconfigured") return <SetupNotice />;
  if (leadResult.status === "error") return <ErrorState message={leadResult.message} />;
  if (followUpsResult.status === "error") return <ErrorState message={followUpsResult.message} />;
  const lead = leadResult.data;
  const canWrite = membership?.role === "manager" || membership?.role === "employee";

  return <section>
    <Link href="/leads" className="mb-4 inline-flex rounded text-sm text-teal-800 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-teal-600">العودة إلى العملاء</Link>
    <PageHeader title={lead.full_name} description={`عميل محتمل — ${LEAD_STAGE_LABELS[lead.stage]}`} />
    <ActionNotice state={query.state} />
    <dl className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
      <div><dt className="text-slate-500">الهاتف</dt><dd className="mt-1 text-slate-900">{lead.phone ?? "—"}</dd></div>
      <div><dt className="text-slate-500">البريد</dt><dd className="mt-1 text-slate-900">{lead.email ?? "—"}</dd></div>
      <div><dt className="text-slate-500">المصدر</dt><dd className="mt-1 text-slate-900">{lead.source ?? "—"}</dd></div>
      <div><dt className="text-slate-500">الوسيط المسؤول</dt><dd className="mt-1 text-slate-900">{lead.assignedBrokerName ?? "غير معيّن"}</dd></div>
      <div><dt className="text-slate-500">المشروع المهتم به</dt><dd className="mt-1 text-slate-900">{lead.interestedProjectName ?? "—"}</dd></div>
      <div><dt className="text-slate-500">تاريخ الإضافة</dt><dd className="mt-1 text-slate-900">{formatDateTime(lead.created_at)}</dd></div>
      {lead.notes ? <div className="sm:col-span-2 lg:col-span-3"><dt className="text-slate-500">ملاحظات العميل</dt><dd className="mt-1 whitespace-pre-wrap text-slate-900">{lead.notes}</dd></div> : null}
    </dl>
    <h2 className="mb-3 text-lg font-semibold text-slate-900">سجل المتابعة</h2>
    {canWrite ? <CreateFollowUpForm leadId={lead.id} /> : null}
    <LeadFollowUps leadId={lead.id} followUps={followUpsResult.data} canWrite={canWrite} />
  </section>;
}
