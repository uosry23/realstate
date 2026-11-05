import type { Project } from "@/features/projects/types";
import type { Broker } from "@/features/brokers/types";
import { createLead } from "@/features/leads/actions";
import { LEAD_STAGE_LABELS } from "@/features/leads/types";
import { CreateRecordPanel } from "@/components/ui/create-record-panel";
import { formGridClass, inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";
import type { LeadStage } from "@/types/database";

export function CreateLeadForm({ projects, brokers }: { projects: Project[]; brokers: Broker[] }) {
  const stages = Object.entries(LEAD_STAGE_LABELS) as [LeadStage, string][];
  return <CreateRecordPanel title="إضافة عميل محتمل">
    <form action={createLead} className="space-y-4">
      <div className={formGridClass}>
        <label className={labelClass}>اسم العميل<input className={inputClass} name="full_name" required minLength={2} /></label>
        <label className={labelClass}>الهاتف<input className={inputClass} name="phone" type="tel" /></label>
        <label className={labelClass}>البريد الإلكتروني<input className={inputClass} name="email" type="email" /></label>
        <label className={labelClass}>المصدر<input className={inputClass} name="source" /></label>
        <label className={labelClass}>المرحلة<select className={inputClass} name="stage" defaultValue="new">{stages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className={labelClass}>الوسيط<select className={inputClass} name="assigned_broker_id" defaultValue=""><option value="">غير معيّن</option>{brokers.filter((broker) => broker.is_active).map((broker) => <option key={broker.id} value={broker.id}>{broker.full_name}</option>)}</select></label>
        <label className={labelClass}>المشروع المهتم به<select className={inputClass} name="interested_project_id" defaultValue=""><option value="">غير محدد</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
      </div>
      <label className={labelClass}>ملاحظات<textarea className={inputClass} name="notes" rows={3} /></label>
      <SubmitButton>حفظ العميل</SubmitButton>
    </form>
  </CreateRecordPanel>;
}
