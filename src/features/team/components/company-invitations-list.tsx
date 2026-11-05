"use client";

import { revokeCompanyInvitation } from "@/features/team/actions";
import { COMPANY_ROLE_LABELS, type CompanyInvitation } from "@/features/team/types";
import { formatDateTime } from "@/lib/format/date";
import type { FormEvent } from "react";

function invitationStatus(invitation: CompanyInvitation): { label: string; canRevoke: boolean } {
  if (invitation.accepted_at) return { label: "مقبولة", canRevoke: false };
  if (invitation.revoked_at) return { label: "ملغاة", canRevoke: false };
  if (new Date(invitation.expires_at).getTime() <= Date.now()) return { label: "منتهية", canRevoke: false };
  return { label: "بانتظار التسجيل", canRevoke: true };
}

export function CompanyInvitationsList({ invitations }: { invitations: CompanyInvitation[] }) {
  if (invitations.length === 0) return <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">لا توجد دعوات حتى الآن.</p>;
  return <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="min-w-full text-right text-sm">
      <thead className="bg-slate-50 text-slate-600"><tr>
        <th scope="col" className="px-4 py-3 font-medium">البريد</th>
        <th scope="col" className="px-4 py-3 font-medium">الدور</th>
        <th scope="col" className="px-4 py-3 font-medium">الحالة</th>
        <th scope="col" className="px-4 py-3 font-medium">الصلاحية حتى</th>
        <th scope="col" className="px-4 py-3 font-medium">إجراء</th>
      </tr></thead>
      <tbody>{invitations.map((invitation) => {
        const status = invitationStatus(invitation);
        return <tr key={invitation.id} className="border-t border-slate-100">
          <td className="px-4 py-3 text-slate-900">{invitation.invited_email}</td>
          <td className="px-4 py-3 text-slate-700">{COMPANY_ROLE_LABELS[invitation.role]}</td>
          <td className="px-4 py-3 text-slate-700">{status.label}</td>
          <td className="px-4 py-3 text-slate-600">{formatDateTime(invitation.expires_at)}</td>
          <td className="px-4 py-3">{status.canRevoke ? <form action={revokeCompanyInvitation} onSubmit={(event: FormEvent<HTMLFormElement>) => {
            if (!window.confirm(`هل تريد إلغاء دعوة ${invitation.invited_email}؟`)) event.preventDefault();
          }}>
            <input type="hidden" name="invitation_id" value={invitation.id} />
            <button className="rounded-md border border-rose-200 px-2 py-1.5 text-xs font-medium text-rose-800 outline-none hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-600">إلغاء الدعوة</button>
          </form> : "—"}</td>
        </tr>;
      })}</tbody>
    </table>
  </div>;
}
