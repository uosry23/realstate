"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentWritableCompanyId } from "@/lib/auth/get-current-company-id";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ServiceRequestStatus, ServiceRequestType } from "@/types/database";

export async function createServiceRequest(formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const typeValue = formData.get("request_type");
  const unitValue = formData.get("unit_id");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof title !== "string" || title.trim().length < 3 || (typeValue !== "after_sales" && typeValue !== "maintenance")) redirect("/service-requests?state=error");
  const unitId = typeof unitValue === "string" && unitValue ? unitValue : null;
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/service-requests?state=error");
  if (unitId) {
    const { data } = await supabase.from("units").select("id").eq("id", unitId).eq("company_id", companyId).maybeSingle();
    if (!data) redirect("/service-requests?state=error");
  }
  const { error } = await supabase.from("service_requests").insert({
    company_id: companyId,
    title: title.trim(),
    description: typeof description === "string" && description.trim() ? description.trim() : null,
    request_type: typeValue as ServiceRequestType,
    unit_id: unitId,
  });
  if (error) redirect("/service-requests?state=error");
  revalidatePath("/service-requests");
  redirect("/service-requests?state=created");
}

export async function updateServiceRequestStatus(formData: FormData) {
  const requestId = formData.get("request_id");
  const nextStatus = formData.get("status");
  const statuses: ServiceRequestStatus[] = ["open", "in_progress", "resolved", "closed"];
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(requestId) || typeof nextStatus !== "string" || !statuses.includes(nextStatus as ServiceRequestStatus)) redirect("/service-requests?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/service-requests?state=error");
  const { data, error } = await supabase.from("service_requests").update({ status: nextStatus as ServiceRequestStatus }).eq("id", requestId).eq("company_id", companyId).select("id").maybeSingle();
  if (error || !data) redirect("/service-requests?state=error");
  revalidatePath("/");
  revalidatePath("/service-requests");
  redirect("/service-requests?state=created");
}

export async function updateServiceRequest(formData: FormData) {
  const requestId = formData.get("request_id");
  const title = formData.get("title");
  const description = formData.get("description");
  const typeValue = formData.get("request_type");
  const unitValue = formData.get("unit_id");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(requestId) || typeof title !== "string" || title.trim().length < 3 || (typeValue !== "after_sales" && typeValue !== "maintenance")) redirect("/service-requests?state=error");
  const unitId = typeof unitValue === "string" && unitValue ? unitValue : null;
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/service-requests?state=error");
  if (unitId) {
    const { data } = await supabase.from("units").select("id").eq("id", unitId).eq("company_id", companyId).maybeSingle();
    if (!data) redirect("/service-requests?state=error");
  }
  const { data, error } = await supabase.from("service_requests").update({
    title: title.trim(),
    description: typeof description === "string" && description.trim() ? description.trim() : null,
    request_type: typeValue as ServiceRequestType,
    unit_id: unitId,
  }).eq("id", requestId).eq("company_id", companyId).select("id").maybeSingle();
  if (error || !data) redirect("/service-requests?state=error");
  revalidatePath("/service-requests");
  redirect("/service-requests?state=created");
}
