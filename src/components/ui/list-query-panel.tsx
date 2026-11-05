import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SetupNotice } from "@/components/ui/setup-notice";
import type { QueryResult } from "@/lib/supabase/query-result";

type ListQueryPanelProps<T> = {
  result: QueryResult<T[]>;
  emptyTitle: string;
  emptyDescription: string;
  children: (rows: T[]) => ReactNode;
};

export function ListQueryPanel<T>({
  result,
  emptyTitle,
  emptyDescription,
  children,
}: ListQueryPanelProps<T>) {
  if (result.status === "unconfigured") {
    return <SetupNotice />;
  }

  if (result.status === "error") {
    return <ErrorState message={result.message} />;
  }

  if (result.data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return <>{children(result.data)}</>;
}
