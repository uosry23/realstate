import { StatusBadge } from "@/components/ui/status-badge";
import {
  SERVICE_REQUEST_STATUS_LABELS,
  SERVICE_REQUEST_TYPE_LABELS,
  type ServiceRequestListItem,
} from "@/features/service-requests/types";
import { formatDateTime } from "@/lib/format/date";
import { updateServiceRequestStatus } from "@/features/service-requests/actions";
import type { ServiceRequestStatus } from "@/types/database";
import type { UnitListItem } from "@/features/units/types";
import { EditServiceRequestForm } from "@/features/service-requests/components/edit-service-request-form";

const requestStatuses = Object.entries(SERVICE_REQUEST_STATUS_LABELS) as [ServiceRequestStatus, string][];

type ServiceRequestsTableProps = {
  serviceRequests: ServiceRequestListItem[];
  units: UnitListItem[];
  canWrite: boolean;
};

export function ServiceRequestsTable({
  serviceRequests,
  units,
  canWrite,
}: ServiceRequestsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-right text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              الطلب
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              النوع
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الوحدة
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الحالة
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              تاريخ الإنشاء
            </th>
            {canWrite ? <th scope="col" className="px-4 py-3 font-medium">تحديث الحالة</th> : null}
            {canWrite ? <th scope="col" className="px-4 py-3 font-medium">البيانات</th> : null}
          </tr>
        </thead>
        <tbody>
          {serviceRequests.map((request) => (
            <tr key={request.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">
                {request.title}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {SERVICE_REQUEST_TYPE_LABELS[request.request_type]}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {request.unitCode ?? "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={SERVICE_REQUEST_STATUS_LABELS[request.status]}
                  tone={request.status}
                />
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDateTime(request.created_at)}
              </td>
              {canWrite ? <td className="px-4 py-3">
                <form action={updateServiceRequestStatus} className="flex min-w-48 items-center gap-2">
                  <input type="hidden" name="request_id" value={request.id} />
                  <label className="sr-only" htmlFor={`request-status-${request.id}`}>حالة الطلب {request.title}</label>
                  <select id={`request-status-${request.id}`} className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-teal-600" name="status" defaultValue={request.status}>
                    {requestStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <button className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-600">تحديث</button>
                </form>
              </td> : null}
              {canWrite ? <td className="px-4 py-3"><EditServiceRequestForm request={request} units={units} /></td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
