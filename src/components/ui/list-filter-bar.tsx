import Link from "next/link";
import type { ReactNode } from "react";

export function ListFilterBar({
  action,
  resetHref,
  children,
}: {
  action: string;
  resetHref: string;
  children: ReactNode;
}) {
  return (
    <form action={action} method="get" role="search" className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
      {children}
      <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white outline-none hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">تطبيق</button>
      <Link href={resetHref} className="rounded-lg px-3 py-2 text-sm text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-600">مسح التصفية</Link>
    </form>
  );
}
