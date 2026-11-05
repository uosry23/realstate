import { createLeadFollowUp } from "@/features/leads/actions";
import { CreateRecordPanel } from "@/components/ui/create-record-panel";
import { inputClass, labelClass, SubmitButton } from "@/components/ui/form-controls";

export function CreateFollowUpForm({ leadId }: { leadId: string }) {
  return <CreateRecordPanel title="إضافة متابعة">
    <form action={createLeadFollowUp} className="space-y-4">
      <input type="hidden" name="lead_id" value={leadId} />
      <label className={labelClass}>موعد المتابعة<input className={inputClass} name="due_date" type="date" /></label>
      <label className={labelClass}>تفاصيل المتابعة<textarea className={inputClass} name="note" required minLength={2} rows={3} /></label>
      <SubmitButton>حفظ المتابعة</SubmitButton>
    </form>
  </CreateRecordPanel>;
}
