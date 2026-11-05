import { updateMemberRole } from "@/features/team/actions";
import { COMPANY_ROLE_LABELS, type CompanyMember } from "@/features/team/types";
import { formatDateTime } from "@/lib/format/date";

export function CompanyMembersTable({ members, currentUserId }: { members: CompanyMember[]; currentUserId: string }) {
  return <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="min-w-full text-right text-sm">
      <thead className="bg-slate-50 text-slate-600"><tr>
        <th scope="col" className="px-4 py-3 font-medium">العضو</th>
        <th scope="col" className="px-4 py-3 font-medium">الدور الحالي</th>
        <th scope="col" className="px-4 py-3 font-medium">تاريخ الانضمام</th>
        <th scope="col" className="px-4 py-3 font-medium">تغيير الدور</th>
      </tr></thead>
      <tbody>{members.map((member) => <tr key={member.id} className="border-t border-slate-100">
        <td className="px-4 py-3 font-medium text-slate-900">{member.full_name}{member.id === currentUserId ? " (أنت)" : ""}</td>
        <td className="px-4 py-3 text-slate-700">{COMPANY_ROLE_LABELS[member.role]}</td>
        <td className="px-4 py-3 text-slate-600">{formatDateTime(member.created_at)}</td>
        <td className="px-4 py-3"><form action={updateMemberRole} className="flex min-w-52 items-center gap-2">
          <input type="hidden" name="member_id" value={member.id} />
          <label className="sr-only" htmlFor={`member-role-${member.id}`}>دور {member.full_name}</label>
          <select id={`member-role-${member.id}`} className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-teal-600" name="role" defaultValue={member.role}>
            {Object.entries(COMPANY_ROLE_LABELS).map(([role, label]) => <option key={role} value={role}>{label}</option>)}
          </select>
          <button className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-600">حفظ</button>
        </form></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
