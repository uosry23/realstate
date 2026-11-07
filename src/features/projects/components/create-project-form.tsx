import { createProject } from "@/features/projects/actions";
import { CreateRecordPanel } from "@/components/ui/create-record-panel";
import { formGridClass, inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function CreateProjectForm() {
  return <CreateRecordPanel title="إضافة مشروع">
    <form action={createProject} className="space-y-4">
      <div className={formGridClass}>
        <label className={labelClass}>اسم المشروع<input className={inputClass} name="name" required minLength={2} /></label>
        <label className={labelClass}>الموقع<input className={inputClass} name="location" /></label>
      </div>
      <label className={labelClass}>الوصف<textarea className={inputClass} name="description" rows={3} /></label>
      <label className={labelClass}>هاتف المطور المسؤول<input className={inputClass} name="developer_phone" type="tel" /></label>
      <SubmitButton>حفظ المشروع</SubmitButton>
    </form>
  </CreateRecordPanel>;
}
