"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentWritableCompanyId } from "@/lib/auth/get-current-company-id";
import { getCurrentMembership } from "@/lib/auth/get-current-membership";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UnitStatus } from "@/types/database";

export async function createUnit(formData: FormData) {
  const projectId = formData.get("project_id");
  const code = formData.get("code");
  const unitType = formData.get("unit_type");
  const floor = formData.get("floor");
  const areaText = formData.get("area_sqm");
  const imageUrl = formData.get("image_url");
  const companyId = await getCurrentWritableCompanyId();
  const area = typeof areaText === "string" && areaText.trim() ? Number(areaText) : null;
  if (!companyId || typeof projectId !== "string" || !/^[0-9a-f-]{36}$/i.test(projectId) || typeof code !== "string" || code.trim().length < 1 || typeof imageUrl !== "string" || !/^https?:\/\/\S+$/i.test(imageUrl) || (area !== null && (!Number.isFinite(area) || area <= 0))) redirect("/units?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/units?state=error");
  const { data: project } = await supabase.from("projects").select("id").eq("id", projectId).eq("company_id", companyId).maybeSingle();
  if (!project) redirect("/units?state=error");
  const { error } = await supabase.from("units").insert({
    company_id: companyId,
    project_id: projectId,
    code: code.trim(),
    unit_type: typeof unitType === "string" && unitType.trim() ? unitType.trim() : null,
    floor: typeof floor === "string" && floor.trim() ? floor.trim() : null,
    area_sqm: area,
    image_url: imageUrl.trim(),
  });
  if (error) redirect("/units?state=error");
  revalidatePath("/");
  revalidatePath("/units");
  redirect("/units?state=created");
}

export async function updateUnitStatus(formData: FormData) {
  const unitId = formData.get("unit_id");
  const nextStatus = formData.get("status");
  const expectedStatus = formData.get("expected_status");
  const statuses: UnitStatus[] = ["available", "reserved", "sold"];
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof unitId !== "string" || !/^[0-9a-f-]{36}$/i.test(unitId) || typeof nextStatus !== "string" || !statuses.includes(nextStatus as UnitStatus) || typeof expectedStatus !== "string" || !statuses.includes(expectedStatus as UnitStatus)) redirect("/units?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/units?state=error");
  const { data, error } = await supabase.from("units").update({ status: nextStatus as UnitStatus }).eq("id", unitId).eq("company_id", companyId).eq("status", expectedStatus as UnitStatus).select("id").maybeSingle();
  if (error) redirect("/units?state=error");
  if (!data) redirect("/units?state=conflict");
  revalidatePath("/");
  revalidatePath("/units");
  redirect("/units?state=created");
}

export async function updateUnitDetails(formData: FormData) {
  const unitId = formData.get("unit_id");
  const code = formData.get("code");
  const unitType = formData.get("unit_type");
  const floor = formData.get("floor");
  const areaText = formData.get("area_sqm");
  const imageUrl = formData.get("image_url");
  const area = typeof areaText === "string" && areaText.trim() ? Number(areaText) : null;
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof unitId !== "string" || !/^[0-9a-f-]{36}$/i.test(unitId) || typeof code !== "string" || !code.trim() || (typeof imageUrl === "string" && imageUrl.trim() && !/^https?:\/\/\S+$/i.test(imageUrl)) || (area !== null && (!Number.isFinite(area) || area <= 0))) redirect("/units?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/units?state=error");
  const { data, error } = await supabase.from("units").update({
    code: code.trim(),
    unit_type: typeof unitType === "string" && unitType.trim() ? unitType.trim() : null,
    floor: typeof floor === "string" && floor.trim() ? floor.trim() : null,
    area_sqm: area,
    image_url: typeof imageUrl === "string" && imageUrl.trim() ? imageUrl.trim() : null,
  }).eq("id", unitId).eq("company_id", companyId).select("id").maybeSingle();
  if (error || !data) redirect("/units?state=error");
  revalidatePath("/units");
  revalidatePath("/service-requests");
  redirect("/units?state=created");
}

export async function deleteUnit(formData: FormData) {
  const unitId = formData.get("unit_id");
  const membership = await getCurrentMembership();
  if (!membership || membership.role !== "manager" || typeof unitId !== "string" || !/^[0-9a-f-]{36}$/i.test(unitId)) redirect("/units?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/units?state=error");
  const { error } = await supabase.from("units").delete().eq("id", unitId).eq("company_id", membership.companyId);
  if (error) redirect("/units?state=error");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/units");
  redirect("/units?state=deleted");
}
