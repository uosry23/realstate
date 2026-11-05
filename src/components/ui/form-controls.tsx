import type { ReactNode } from "react";

export const inputClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600";
export const labelClass = "block text-sm font-medium text-slate-700";
export const formGridClass = "grid gap-4 sm:grid-cols-2";

export function SubmitButton({ children }: { children: ReactNode }) {
  return <button className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white outline-none hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">{children}</button>;
}
