"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentWritableCompanyId } from "@/lib/auth/get-current-company-id";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createProject(formData: FormData) {
  const name = formData.get("name");
  const location = formData.get("location");
  const description = formData.get("description");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof name !== "string" || name.trim().length < 2) {
    redirect("/projects?state=error");
  }
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/projects?state=error");
  const { error } = await supabase.from("projects").insert({
    company_id: companyId,
    name: name.trim(),
    location: typeof location === "string" && location.trim() ? location.trim() : null,
    description: typeof description === "string" && description.trim() ? description.trim() : null,
  });
  if (error) redirect("/projects?state=error");
  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/projects?state=created");
}

export async function updateProject(formData: FormData) {
  const projectId = formData.get("project_id");
  const name = formData.get("name");
  const location = formData.get("location");
  const description = formData.get("description");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof projectId !== "string" || !/^[0-9a-f-]{36}$/i.test(projectId) || typeof name !== "string" || name.trim().length < 2) redirect("/projects?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/projects?state=error");
  const { data, error } = await supabase.from("projects").update({
    name: name.trim(),
    location: typeof location === "string" && location.trim() ? location.trim() : null,
    description: typeof description === "string" && description.trim() ? description.trim() : null,
  }).eq("id", projectId).eq("company_id", companyId).select("id").maybeSingle();
  if (error || !data) redirect("/projects?state=error");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/units");
  redirect("/projects?state=created");
}
