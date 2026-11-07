import type { UnitListItem } from "@/features/units/types";
import { updateUnitDetails } from "@/features/units/actions";
import { InlineEditPanel } from "@/components/ui/inline-edit-panel";
import { inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function EditUnitForm({ unit }: { unit: UnitListItem }) {
  return <InlineEditPanel>
    <form action={updateUnitDetails} className="space-y-3">
      <input type="hidden" name="unit_id" value={unit.id} />
      <label className={labelClass}>كود الوحدة<input className={inputClass} name="code" required defaultValue={unit.code} /></label>
      <label className={labelClass}>نوع الوحدة<input className={inputClass} name="unit_type" defaultValue={unit.unit_type ?? ""} /></label>
      <label className={labelClass}>الدور<input className={inputClass} name="floor" defaultValue={unit.floor ?? ""} /></label>
      <label className={labelClass}>المساحة (م²)<input className={inputClass} name="area_sqm" type="number" min="0.01" step="0.01" defaultValue={unit.area_sqm ?? ""} /></label>
      <label className={labelClass}>رابط صورة الوحدة<input className={inputClass} name="image_url" type="url" defaultValue={unit.image_url ?? ""} /></label>
      <SubmitButton>حفظ التعديلات</SubmitButton>
    </form>
  </InlineEditPanel>;
}
