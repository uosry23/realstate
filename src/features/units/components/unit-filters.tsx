import type { Project } from "@/features/projects/types";
import { UNIT_STATUS_LABELS } from "@/features/units/types";
import type { UnitStatus } from "@/types/database";
import { ListFilterBar } from "@/components/ui/list-filter-bar";
import { inputClass, labelClass } from "@/components/ui/form-controls";

export function UnitFilters({ search, status, projectId, projects }: { search: string; status: UnitStatus | ""; projectId: string; projects: Project[] }) {
  const statuses = Object.entries(UNIT_STATUS_LABELS) as [UnitStatus, string][];
  return <ListFilterBar action="/units" resetHref="/units">
    <label className={labelClass}>كود الوحدة<input className={inputClass} name="search" type="search" maxLength={100} defaultValue={search} /></label>
    <label className={labelClass}>الحالة<select className={inputClass} name="status" defaultValue={status}><option value="">كل الحالات</option>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label className={labelClass}>المشروع<select className={inputClass} name="project_id" defaultValue={projectId}><option value="">كل المشاريع</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
  </ListFilterBar>;
}
