import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export default function NotFound() {
  return (
    <section>
      <PageHeader
        title="الصفحة غير موجودة"
        description="المسار المطلوب غير متاح ضمن نظام إدارة العقارات."
      />
      <Link
        href="/"
        className="inline-flex rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white outline-none hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        العودة إلى لوحة التشغيل
      </Link>
    </section>
  );
}
