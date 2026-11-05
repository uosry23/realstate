import type { ServiceRequestListItem } from "@/features/service-requests/types";
import type { UnitListItem } from "@/features/units/types";
import { updateServiceRequest } from "@/features/service-requests/actions";
import { InlineEditPanel } from "@/components/ui/inline-edit-panel";
import { inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function EditServiceRequestForm({ request, units }: { request: ServiceRequestListItem; units: UnitListItem[] }) {
  return <InlineEditPanel>
    <form action={updateServiceRequest} className="space-y-3">
      <input type="hidden" name="request_id" value={request.id} />
      <label className={labelClass}>عنوان الطلب<input className={inputClass} name="title" required minLength={3} defaultValue={request.title} /></label>
      <label className={labelClass}>النوع<select className={inputClass} name="request_type" defaultValue={request.request_type}><option value="maintenance">صيانة</option><option value="after_sales">ما بعد البيع</option></select></label>
      <label className={labelClass}>الوحدة<select className={inputClass} name="unit_id" defaultValue={request.unit_id ?? ""}><option value="">غير مرتبطة بوحدة</option>{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.code} — {unit.projectName ?? "مشروع"}</option>)}</select></label>
      <label className={labelClass}>التفاصيل<textarea className={inputClass} name="description" rows={3} defaultValue={request.description ?? ""} /></label>
      <SubmitButton>حفظ التعديلات</SubmitButton>
    </form>
  </InlineEditPanel>;
}
