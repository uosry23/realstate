type StatusTone =
  | "available"
  | "reserved"
  | "sold"
  | "new"
  | "follow_up"
  | "viewing"
  | "negotiation"
  | "won"
  | "lost"
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  available: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  reserved: "bg-amber-50 text-amber-800 ring-amber-200",
  sold: "bg-slate-100 text-slate-700 ring-slate-200",
  new: "bg-sky-50 text-sky-800 ring-sky-200",
  follow_up: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  viewing: "bg-teal-50 text-teal-800 ring-teal-200",
  negotiation: "bg-amber-50 text-amber-800 ring-amber-200",
  won: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  lost: "bg-rose-50 text-rose-800 ring-rose-200",
  open: "bg-sky-50 text-sky-800 ring-sky-200",
  in_progress: "bg-amber-50 text-amber-800 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  closed: "bg-slate-100 text-slate-700 ring-slate-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
};

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}
