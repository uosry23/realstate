import { createBroker } from "@/features/brokers/actions";
import { CreateRecordPanel } from "@/components/ui/create-record-panel";
import { formGridClass, inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function CreateBrokerForm() {
  return <CreateRecordPanel title="إضافة وسيط">
    <form action={createBroker} className="space-y-4">
      <div className={formGridClass}>
        <label className={labelClass}>اسم الوسيط<input className={inputClass} name="full_name" required minLength={2} /></label>
        <label className={labelClass}>الهاتف<input className={inputClass} name="phone" type="tel" /></label>
        <label className={labelClass}>البريد الإلكتروني<input className={inputClass} name="email" type="email" /></label>
      </div>
      <SubmitButton>حفظ الوسيط</SubmitButton>
    </form>
  </CreateRecordPanel>;
}
