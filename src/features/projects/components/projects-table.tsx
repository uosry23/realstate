import type { Project } from "@/features/projects/types";
import { formatDateTime } from "@/lib/format/date";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { DeleteRecordForm } from "@/components/ui/delete-record-form";
import { deleteProject } from "@/features/projects/actions";

type ProjectsTableProps = {
  projects: Project[];
  canWrite: boolean;
  canDelete: boolean;
};

export function ProjectsTable({ projects, canWrite, canDelete }: ProjectsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-right text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              المشروع
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الموقع
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              الوصف
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              تاريخ الإنشاء
            </th>
            {canWrite ? <th scope="col" className="px-4 py-3 font-medium">الإجراءات</th> : null}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">
                {project.name}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {project.location ?? "—"}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {project.description ?? "—"}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDateTime(project.created_at)}
              </td>
              {canWrite ? <td className="flex gap-2 px-4 py-3"><EditProjectForm project={project} />{canDelete ? <DeleteRecordForm action={deleteProject} field="project_id" value={project.id} message={`حذف مشروع ${project.name} وكل وحداته؟`} /> : null}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
