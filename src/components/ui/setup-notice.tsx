export function SetupNotice() {
  return (
    <div
      role="status"
      className="rounded-xl border border-teal-200 bg-teal-50 px-6 py-5 text-teal-900"
    >
      <p className="font-medium">إعداد قاعدة البيانات مطلوب</p>
      <p className="mt-1 text-sm">
        أضف قيم{" "}
        <code className="rounded bg-teal-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> و
        <code className="rounded bg-teal-100 px-1">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{" "}
        في ملف البيئة، ثم نفّذ ملفات الهجرة بالترتيب من مجلد{" "}
        <code className="rounded bg-teal-100 px-1">supabase/migrations</code>
        .
        .
      </p>
    </div>
  );
}
