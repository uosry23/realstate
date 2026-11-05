import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SetupNotice } from "@/components/ui/setup-notice";
import type { PaginatedRows, QueryResult } from "@/lib/supabase/query-result";

type PaginatedListQueryPanelProps<T> = {
  result: QueryResult<PaginatedRows<T>>;
  emptyTitle: string;
  emptyDescription: string;
  basePath: string;
  searchParams: Record<string, string>;
  children: (rows: T[]) => React.ReactNode;
};

export function PaginatedListQueryPanel<T>({
  result,
  emptyTitle,
  emptyDescription,
  basePath,
  searchParams,
  children,
}: PaginatedListQueryPanelProps<T>) {
  if (result.status === "unconfigured") return <SetupNotice />;
  if (result.status === "error") return <ErrorState message={result.message} />;
  const { rows, totalCount, page, pageSize } = result.data;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <>
      {rows.length === 0 ? <EmptyState title={emptyTitle} description={emptyDescription} /> : children(rows)}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <p>عرض {from}–{to} من {totalCount}</p>
        {pageCount > 1 ? (
          <nav aria-label="صفحات القائمة" className="flex items-center gap-2">
            {page > 1 ? <Link href={{ pathname: basePath, query: { ...searchParams, page: String(page - 1) } }} className="rounded-md border border-slate-300 px-3 py-1.5 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-teal-600">السابق</Link> : null}
            <span aria-current="page" className="px-2">صفحة {page} من {pageCount}</span>
            {page < pageCount ? <Link href={{ pathname: basePath, query: { ...searchParams, page: String(page + 1) } }} className="rounded-md border border-slate-300 px-3 py-1.5 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-teal-600">التالي</Link> : null}
          </nav>
        ) : null}
      </div>
    </>
  );
}
