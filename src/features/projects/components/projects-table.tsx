import type { Project } from "@/features/projects/types";
import { formatDateTime } from "@/lib/format/date";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

type ProjectsTableProps = {
  projects: Project[];
  canWrite: boolean;
};

export function ProjectsTable({ projects, canWrite }: ProjectsTableProps) {
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
              {canWrite ? <td className="px-4 py-3"><EditProjectForm project={project} /></td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
