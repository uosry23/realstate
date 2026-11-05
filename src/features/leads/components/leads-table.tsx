import { StatusBadge } from "@/components/ui/status-badge";
import { LEAD_STAGE_LABELS, type LeadListItem } from "@/features/leads/types";
import { updateLeadStage } from "@/features/leads/actions";
import type { LeadStage } from "@/types/database";
import type { Broker } from "@/features/brokers/types";
import type { Project } from "@/features/projects/types";
import { EditLeadForm } from "@/features/leads/components/edit-lead-form";
import Link from "next/link";

const leadStages = Object.entries(LEAD_STAGE_LABELS) as [LeadStage, string][];

type LeadsTableProps = {
  leads: LeadListItem[];
  brokers: Broker[];
  projects: Project[];
  canWrite: boolean;
};

export function LeadsTable({ leads, brokers, projects, canWrite }: LeadsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-right text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              العميل
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الهاتف
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              المرحلة
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الوسيط
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              المشروع المهتم به
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              المصدر
            </th>
            {canWrite ? <th scope="col" className="px-4 py-3 font-medium">تحديث المرحلة</th> : null}
            {canWrite ? <th scope="col" className="px-4 py-3 font-medium">البيانات والتوزيع</th> : null}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">
                <Link href={`/leads/${lead.id}`} className="rounded outline-none hover:text-teal-800 hover:underline focus-visible:ring-2 focus-visible:ring-teal-600">{lead.full_name}</Link>
              </td>
              <td className="px-4 py-3 text-slate-700">{lead.phone ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={LEAD_STAGE_LABELS[lead.stage]}
                  tone={lead.stage}
                />
              </td>
              <td className="px-4 py-3 text-slate-700">
                {lead.assignedBrokerName ?? "غير معيّن"}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {lead.interestedProjectName ?? "—"}
              </td>
              <td className="px-4 py-3 text-slate-700">{lead.source ?? "—"}</td>
              {canWrite ? <td className="px-4 py-3">
                <form action={updateLeadStage} className="flex min-w-48 items-center gap-2">
                  <input type="hidden" name="lead_id" value={lead.id} />
                  <label className="sr-only" htmlFor={`lead-stage-${lead.id}`}>مرحلة العميل {lead.full_name}</label>
                  <select id={`lead-stage-${lead.id}`} className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-teal-600" name="stage" defaultValue={lead.stage}>
                    {leadStages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <button className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-600">تحديث</button>
                </form>
              </td> : null}
              {canWrite ? <td className="px-4 py-3"><EditLeadForm lead={lead} brokers={brokers} projects={projects} /></td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
