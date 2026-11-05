import type { Project } from "@/features/projects/types";
import type { Broker } from "@/features/brokers/types";
import type { LeadListItem } from "@/features/leads/types";
import { LEAD_STAGE_LABELS } from "@/features/leads/types";
import { updateLead } from "@/features/leads/actions";
import { InlineEditPanel } from "@/components/ui/inline-edit-panel";
import { inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";
import type { LeadStage } from "@/types/database";

export function EditLeadForm({ lead, brokers, projects }: { lead: LeadListItem; brokers: Broker[]; projects: Project[] }) {
  const stages = Object.entries(LEAD_STAGE_LABELS) as [LeadStage, string][];
  return <InlineEditPanel>
    <form action={updateLead} className="space-y-3">
      <input type="hidden" name="lead_id" value={lead.id} />
      <label className={labelClass}>اسم العميل<input className={inputClass} name="full_name" required minLength={2} defaultValue={lead.full_name} /></label>
      <label className={labelClass}>الهاتف<input className={inputClass} name="phone" type="tel" defaultValue={lead.phone ?? ""} /></label>
      <label className={labelClass}>البريد الإلكتروني<input className={inputClass} name="email" type="email" defaultValue={lead.email ?? ""} /></label>
      <label className={labelClass}>المصدر<input className={inputClass} name="source" defaultValue={lead.source ?? ""} /></label>
      <label className={labelClass}>المرحلة<select className={inputClass} name="stage" defaultValue={lead.stage}>{stages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className={labelClass}>الوسيط<select className={inputClass} name="assigned_broker_id" defaultValue={lead.assigned_broker_id ?? ""}><option value="">غير معيّن</option>{brokers.filter((broker) => broker.is_active || broker.id === lead.assigned_broker_id).map((broker) => <option key={broker.id} value={broker.id}>{broker.full_name}</option>)}</select></label>
      <label className={labelClass}>المشروع المهتم به<select className={inputClass} name="interested_project_id" defaultValue={lead.interested_project_id ?? ""}><option value="">غير محدد</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
      <label className={labelClass}>ملاحظات<textarea className={inputClass} name="notes" rows={3} defaultValue={lead.notes ?? ""} /></label>
      <SubmitButton>حفظ التعديلات</SubmitButton>
    </form>
  </InlineEditPanel>;
}
