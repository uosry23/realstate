import { StatusBadge } from "@/components/ui/status-badge";
import type { Broker } from "@/features/brokers/types";
import { EditBrokerForm } from "@/features/brokers/components/edit-broker-form";

type BrokersTableProps = {
  brokers: Broker[];
  canWrite: boolean;
};

export function BrokersTable({ brokers, canWrite }: BrokersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-right text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              الوسيط
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الهاتف
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              البريد
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الحالة
            </th>
            {canWrite ? <th scope="col" className="px-4 py-3 font-medium">الإجراءات</th> : null}
          </tr>
        </thead>
        <tbody>
          {brokers.map((broker) => (
            <tr key={broker.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">
                {broker.full_name}
              </td>
              <td className="px-4 py-3 text-slate-700">{broker.phone ?? "—"}</td>
              <td className="px-4 py-3 text-slate-700">{broker.email ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={broker.is_active ? "نشط" : "غير نشط"}
                  tone={broker.is_active ? "available" : "sold"}
                />
              </td>
              {canWrite ? <td className="px-4 py-3"><EditBrokerForm broker={broker} /></td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
