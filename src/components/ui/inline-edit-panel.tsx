import type { ReactNode } from "react";

export function InlineEditPanel({ children }: { children: ReactNode }) {
  return (
    <details className="min-w-32 rounded-lg border border-slate-200 bg-white p-2">
      <summary className="cursor-pointer text-center text-xs font-medium text-teal-800 outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
        تعديل البيانات
      </summary>
      <div className="min-w-64 space-y-3 p-2">{children}</div>
    </details>
  );
}
