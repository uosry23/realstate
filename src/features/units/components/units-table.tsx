import { StatusBadge } from "@/components/ui/status-badge";
import { UNIT_STATUS_LABELS, type UnitListItem } from "@/features/units/types";
import { UnitStatusForm } from "@/features/units/components/unit-status-form";
import { EditUnitForm } from "@/features/units/components/edit-unit-form";
import Link from "next/link";

type UnitsTableProps = {
  units: UnitListItem[];
  canWrite: boolean;
};

export function UnitsTable({ units, canWrite }: UnitsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-right text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              كود الوحدة
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              المشروع
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              النوع
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الدور
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              المساحة
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الحالة
            </th>
            {canWrite ? <th scope="col" className="px-4 py-3 font-medium">تحديث الحالة</th> : null}
            {canWrite ? <th scope="col" className="px-4 py-3 font-medium">البيانات</th> : null}
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900"><Link href={`/units/${unit.id}`} className="rounded outline-none hover:text-teal-800 hover:underline focus-visible:ring-2 focus-visible:ring-teal-600">{unit.code}</Link></td>
              <td className="px-4 py-3 text-slate-700">
                {unit.projectName ?? "—"}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {unit.unit_type ?? "—"}
              </td>
              <td className="px-4 py-3 text-slate-700">{unit.floor ?? "—"}</td>
              <td className="px-4 py-3 text-slate-700">
                {unit.area_sqm ?? "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={UNIT_STATUS_LABELS[unit.status]}
                  tone={unit.status}
                />
              </td>
              {canWrite ? <td className="px-4 py-3"><UnitStatusForm unitId={unit.id} currentStatus={unit.status} /></td> : null}
              {canWrite ? <td className="px-4 py-3"><EditUnitForm unit={unit} /></td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
