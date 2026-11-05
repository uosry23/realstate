import { ListFilterBar } from "@/components/ui/list-filter-bar";
import { inputClass, labelClass } from "@/components/ui/form-controls";
import { LEAD_STAGE_LABELS } from "@/features/leads/types";
import type { LeadStage } from "@/types/database";

export function LeadFilters({ search, stage }: { search: string; stage: LeadStage | "" }) {
  const stages = Object.entries(LEAD_STAGE_LABELS) as [LeadStage, string][];
  return <ListFilterBar action="/leads" resetHref="/leads">
    <label className={labelClass}>اسم العميل<input className={inputClass} name="search" type="search" maxLength={100} defaultValue={search} /></label>
    <label className={labelClass}>مرحلة العميل<select className={inputClass} name="stage" defaultValue={stage}><option value="">كل المراحل</option>{stages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
  </ListFilterBar>;
}
