export function readSearchValue(value: string | string[] | undefined): string {
  return typeof value === "string" ? value.trim().slice(0, 100) : "";
}

export function escapeLikeValue(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export function buildIlikeOrFilter(columns: readonly string[], value: string): string {
  const escaped = escapeLikeValue(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
  const pattern = `"%${escaped}%"`;
  return columns.map((column) => `${column}.ilike.${pattern}`).join(",");
}
