import type { Project } from "@/features/projects/types";
import { createUnit } from "@/features/units/actions";
import { CreateRecordPanel } from "@/components/ui/create-record-panel";
import { formGridClass, inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function CreateUnitForm({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">أضف مشروعًا أولًا حتى تتمكن من تسجيل وحداته.</p>;
  return <CreateRecordPanel title="إضافة وحدة">
    <form action={createUnit} className="space-y-4">
      <div className={formGridClass}>
        <label className={labelClass}>المشروع<select className={inputClass} name="project_id" required defaultValue=""><option value="" disabled>اختر المشروع</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
        <label className={labelClass}>كود الوحدة<input className={inputClass} name="code" required /></label>
        <label className={labelClass}>نوع الوحدة<input className={inputClass} name="unit_type" /></label>
        <label className={labelClass}>الدور<input className={inputClass} name="floor" /></label>
        <label className={labelClass}>المساحة (م²)<input className={inputClass} name="area_sqm" type="number" min="0.01" step="0.01" /></label>
      </div>
      <SubmitButton>حفظ الوحدة</SubmitButton>
    </form>
  </CreateRecordPanel>;
}
