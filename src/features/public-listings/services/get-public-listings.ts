import { runServerQuery } from "@/lib/supabase/run-server-query";
import type { QueryResult } from "@/lib/supabase/query-result";

export type PublicListing = { id: string; code: string; unitType: string | null; floor: string | null; areaSqm: number | null; projectName: string; projectLocation: string | null; developerPhone: string | null; companyName: string };
type PublicListingRow = { id: string; code: string; unit_type: string | null; floor: string | null; area_sqm: number | null; project_name: string; project_location: string | null; developer_phone: string | null; company_name: string };
const toListing = (row: PublicListingRow): PublicListing => ({ id: row.id, code: row.code, unitType: row.unit_type, floor: row.floor, areaSqm: row.area_sqm, projectName: row.project_name, projectLocation: row.project_location, developerPhone: row.developer_phone, companyName: row.company_name });

export async function listPublicListings(): Promise<QueryResult<PublicListing[]>> {
  const result = await runServerQuery((client) => client.from("available_unit_listings").select("id, code, unit_type, floor, area_sqm, project_name, project_location, developer_phone, company_name").order("project_name"));
  return result.status === "ok" ? { status: "ok", data: (result.data as PublicListingRow[]).map(toListing) } : result;
}

export async function getPublicListing(id: string): Promise<QueryResult<PublicListing>> {
  const result = await runServerQuery((client) => client.from("available_unit_listings").select("id, code, unit_type, floor, area_sqm, project_name, project_location, developer_phone, company_name").eq("id", id).maybeSingle());
  if (result.status !== "ok") return result;
  return result.data ? { status: "ok", data: toListing(result.data as PublicListingRow) } : { status: "error", message: "الوحدة لم تعد متاحة." };
}
