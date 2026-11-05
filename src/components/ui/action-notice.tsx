type ActionNoticeProps = {
  state?: string | string[];
};

export function ActionNotice({ state }: ActionNoticeProps) {
  if (!state) return null;
  const success = state === "created" || state === "updated";
  const conflict = state === "conflict";
  return (
    <p role={success ? "status" : "alert"} className={`mb-4 rounded-lg border px-4 py-3 text-sm ${success ? "border-teal-200 bg-teal-50 text-teal-900" : "border-rose-200 bg-rose-50 text-rose-900"}`}>
      {success ? "تم حفظ البيانات بنجاح." : conflict ? "تغيرت حالة الوحدة منذ فتح الصفحة. حدّث البيانات ثم أعد المحاولة." : "تعذر حفظ البيانات. راجع الحقول وحاول مرة أخرى."}
    </p>
  );
}
