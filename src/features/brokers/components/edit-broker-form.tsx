import type { Broker } from "@/features/brokers/types";
import { updateBroker } from "@/features/brokers/actions";
import { InlineEditPanel } from "@/components/ui/inline-edit-panel";
import { inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function EditBrokerForm({ broker }: { broker: Broker }) {
  return <InlineEditPanel>
    <form action={updateBroker} className="space-y-3">
      <input type="hidden" name="broker_id" value={broker.id} />
      <label className={labelClass}>اسم الوسيط<input className={inputClass} name="full_name" required minLength={2} defaultValue={broker.full_name} /></label>
      <label className={labelClass}>الهاتف<input className={inputClass} name="phone" type="tel" defaultValue={broker.phone ?? ""} /></label>
      <label className={labelClass}>البريد الإلكتروني<input className={inputClass} name="email" type="email" defaultValue={broker.email ?? ""} /></label>
      <label className={labelClass}>الحالة<select className={inputClass} name="is_active" defaultValue={String(broker.is_active)}><option value="true">نشط</option><option value="false">غير نشط</option></select></label>
      <SubmitButton>حفظ التعديلات</SubmitButton>
    </form>
  </InlineEditPanel>;
}
