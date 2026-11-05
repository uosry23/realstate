import type { UnitListItem } from "@/features/units/types";
import { createServiceRequest } from "@/features/service-requests/actions";
import { CreateRecordPanel } from "@/components/ui/create-record-panel";
import { formGridClass, inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function CreateServiceRequestForm({ units }: { units: UnitListItem[] }) {
  return <CreateRecordPanel title="تسجيل طلب خدمة">
    <form action={createServiceRequest} className="space-y-4">
      <div className={formGridClass}>
        <label className={labelClass}>عنوان الطلب<input className={inputClass} name="title" required minLength={3} /></label>
        <label className={labelClass}>النوع<select className={inputClass} name="request_type" defaultValue="maintenance"><option value="maintenance">صيانة</option><option value="after_sales">ما بعد البيع</option></select></label>
        <label className={labelClass}>الوحدة<select className={inputClass} name="unit_id" defaultValue=""><option value="">غير مرتبطة بوحدة</option>{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.code} — {unit.projectName ?? "مشروع"}</option>)}</select></label>
      </div>
      <label className={labelClass}>التفاصيل<textarea className={inputClass} name="description" rows={3} /></label>
      <SubmitButton>حفظ الطلب</SubmitButton>
    </form>
  </CreateRecordPanel>;
}
