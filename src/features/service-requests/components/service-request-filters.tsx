import { ListFilterBar } from "@/components/ui/list-filter-bar";
import { inputClass, labelClass } from "@/components/ui/form-controls";
import { SERVICE_REQUEST_STATUS_LABELS, SERVICE_REQUEST_TYPE_LABELS } from "@/features/service-requests/types";
import type { ServiceRequestStatus, ServiceRequestType } from "@/types/database";

export function ServiceRequestFilters({ search, status, type }: { search: string; status: ServiceRequestStatus | ""; type: ServiceRequestType | "" }) {
  const statuses = Object.entries(SERVICE_REQUEST_STATUS_LABELS) as [ServiceRequestStatus, string][];
  const types = Object.entries(SERVICE_REQUEST_TYPE_LABELS) as [ServiceRequestType, string][];
  return <ListFilterBar action="/service-requests" resetHref="/service-requests">
    <label className={labelClass}>عنوان الطلب<input className={inputClass} name="search" type="search" maxLength={100} defaultValue={search} /></label>
    <label className={labelClass}>الحالة<select className={inputClass} name="status" defaultValue={status}><option value="">كل الحالات</option>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label className={labelClass}>النوع<select className={inputClass} name="type" defaultValue={type}><option value="">كل الأنواع</option>{types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
  </ListFilterBar>;
}
