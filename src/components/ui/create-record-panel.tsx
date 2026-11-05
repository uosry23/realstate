import type { ReactNode } from "react";

type CreateRecordPanelProps = {
  title: string;
  children: ReactNode;
};

export function CreateRecordPanel({ title, children }: CreateRecordPanelProps) {
  return (
    <details className="mb-5 rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer px-4 py-3 font-medium text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
        {title}
      </summary>
      <div className="border-t border-slate-100 p-4">{children}</div>
    </details>
  );
}
