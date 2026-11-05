export const PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 1000;

export function normalizePage(value: number | undefined): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? Math.min(value, 1_000_000)
    : 1;
}

export function normalizePageSize(value: number | undefined): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? Math.min(value, MAX_PAGE_SIZE)
    : PAGE_SIZE;
}

export function getPageRange(page: number, pageSize = PAGE_SIZE): { from: number; to: number } {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}
