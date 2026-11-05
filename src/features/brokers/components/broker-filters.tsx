import { ListFilterBar } from "@/components/ui/list-filter-bar";
import { inputClass, labelClass } from "@/components/ui/form-controls";

export function BrokerFilters({ search, active }: { search: string; active: "" | "true" | "false" }) {
  return <ListFilterBar action="/brokers" resetHref="/brokers">
    <label className={labelClass}>اسم الوسيط<input className={inputClass} name="search" type="search" maxLength={100} defaultValue={search} /></label>
    <label className={labelClass}>الحالة<select className={inputClass} name="active" defaultValue={active}><option value="">كل الوسطاء</option><option value="true">نشط</option><option value="false">غير نشط</option></select></label>
  </ListFilterBar>;
}
