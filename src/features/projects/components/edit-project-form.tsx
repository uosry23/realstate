import type { Project } from "@/features/projects/types";
import { updateProject } from "@/features/projects/actions";
import { InlineEditPanel } from "@/components/ui/inline-edit-panel";
import { inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function EditProjectForm({ project }: { project: Project }) {
  return <InlineEditPanel>
    <form action={updateProject} className="space-y-3">
      <input type="hidden" name="project_id" value={project.id} />
      <label className={labelClass}>اسم المشروع<input className={inputClass} name="name" required minLength={2} defaultValue={project.name} /></label>
      <label className={labelClass}>الموقع<input className={inputClass} name="location" defaultValue={project.location ?? ""} /></label>
      <label className={labelClass}>الوصف<textarea className={inputClass} name="description" rows={3} defaultValue={project.description ?? ""} /></label>
      <label className={labelClass}>هاتف المطور المسؤول<input className={inputClass} name="developer_phone" type="tel" defaultValue={project.developer_phone ?? ""} /></label>
      <SubmitButton>حفظ التعديلات</SubmitButton>
    </form>
  </InlineEditPanel>;
}
