"use client";

import type { FormEvent } from "react";
import { updateUnitStatus } from "@/features/units/actions";
import { UNIT_STATUS_LABELS } from "@/features/units/types";
import type { UnitStatus } from "@/types/database";

const statuses: UnitStatus[] = ["available", "reserved", "sold"];

export function UnitStatusForm({ unitId, currentStatus }: { unitId: string; currentStatus: UnitStatus }) {
  function confirmSold(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    if (formData.get("status") === "sold" && !window.confirm("هل تريد تأكيد تحويل هذه الوحدة إلى مباعة؟")) event.preventDefault();
  }

  return <form action={updateUnitStatus} onSubmit={confirmSold} className="flex min-w-48 items-center gap-2">
    <input type="hidden" name="unit_id" value={unitId} />
    <input type="hidden" name="expected_status" value={currentStatus} />
    <label className="sr-only" htmlFor={`unit-status-${unitId}`}>حالة الوحدة</label>
    <select id={`unit-status-${unitId}`} className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-teal-600" name="status" defaultValue={currentStatus}>
      {statuses.map((status) => <option key={status} value={status}>{UNIT_STATUS_LABELS[status]}</option>)}
    </select>
    <button className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-600">تحديث</button>
  </form>;
}
