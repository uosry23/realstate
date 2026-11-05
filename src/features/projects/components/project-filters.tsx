import { ListFilterBar } from "@/components/ui/list-filter-bar";
import { inputClass, labelClass } from "@/components/ui/form-controls";

export function ProjectFilters({ search }: { search: string }) {
  return <ListFilterBar action="/projects" resetHref="/projects">
    <label className={labelClass}>اسم المشروع<input className={inputClass} name="search" type="search" maxLength={100} defaultValue={search} /></label>
  </ListFilterBar>;
}
