export type QueryResult<T> =
  | { status: "unconfigured" }
  | { status: "error"; message: string }
  | { status: "ok"; data: T };

export type PaginatedRows<T> = {
  rows: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};
