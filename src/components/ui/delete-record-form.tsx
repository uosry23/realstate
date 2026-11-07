"use client";

type DeleteRecordFormProps = { action: (formData: FormData) => void; field: string; value: string; message: string };

export function DeleteRecordForm({ action, field, value, message }: DeleteRecordFormProps) {
  return <form action={action} onSubmit={(event) => { if (!window.confirm(message)) event.preventDefault(); }}><input type="hidden" name={field} value={value} /><button className="rounded-md border border-rose-300 px-2 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50">حذف</button></form>;
}
