"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentWritableCompanyId } from "@/lib/auth/get-current-company-id";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LeadStage } from "@/types/database";

const leadStages: LeadStage[] = ["new", "follow_up", "viewing", "negotiation", "won", "lost"];

function isValidFollowUpDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export async function createLead(formData: FormData) {
  const fullName = formData.get("full_name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const source = formData.get("source");
  const stageValue = formData.get("stage");
  const brokerValue = formData.get("assigned_broker_id");
  const projectValue = formData.get("interested_project_id");
  const notes = formData.get("notes");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof fullName !== "string" || fullName.trim().length < 2 || (typeof email === "string" && email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))) redirect("/leads?state=error");
  const stage = typeof stageValue === "string" && leadStages.includes(stageValue as LeadStage) ? stageValue as LeadStage : "new";
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/leads?state=error");
  const brokerId = typeof brokerValue === "string" && brokerValue ? brokerValue : null;
  const projectId = typeof projectValue === "string" && projectValue ? projectValue : null;
  if (brokerId) {
    const { data } = await supabase.from("brokers").select("id").eq("id", brokerId).eq("company_id", companyId).maybeSingle();
    if (!data) redirect("/leads?state=error");
  }
  if (projectId) {
    const { data } = await supabase.from("projects").select("id").eq("id", projectId).eq("company_id", companyId).maybeSingle();
    if (!data) redirect("/leads?state=error");
  }
  const { error } = await supabase.from("leads").insert({
    company_id: companyId,
    full_name: fullName.trim(),
    phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
    email: typeof email === "string" && email.trim() ? email.trim() : null,
    source: typeof source === "string" && source.trim() ? source.trim() : null,
    stage,
    assigned_broker_id: brokerId,
    interested_project_id: projectId,
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
  });
  if (error) redirect("/leads?state=error");
  revalidatePath("/");
  revalidatePath("/leads");
  redirect("/leads?state=created");
}

export async function updateLeadStage(formData: FormData) {
  const leadId = formData.get("lead_id");
  const nextStage = formData.get("stage");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof leadId !== "string" || !/^[0-9a-f-]{36}$/i.test(leadId) || typeof nextStage !== "string" || !leadStages.includes(nextStage as LeadStage)) redirect("/leads?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/leads?state=error");
  const { data, error } = await supabase.from("leads").update({ stage: nextStage as LeadStage }).eq("id", leadId).eq("company_id", companyId).select("id").maybeSingle();
  if (error || !data) redirect("/leads?state=error");
  revalidatePath("/");
  revalidatePath("/leads");
  redirect("/leads?state=created");
}

export async function updateLead(formData: FormData) {
  const leadId = formData.get("lead_id");
  const fullName = formData.get("full_name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const source = formData.get("source");
  const stageValue = formData.get("stage");
  const brokerValue = formData.get("assigned_broker_id");
  const projectValue = formData.get("interested_project_id");
  const notes = formData.get("notes");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof leadId !== "string" || !/^[0-9a-f-]{36}$/i.test(leadId) || typeof fullName !== "string" || fullName.trim().length < 2 || typeof stageValue !== "string" || !leadStages.includes(stageValue as LeadStage) || (typeof email === "string" && email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))) redirect("/leads?state=error");
  const brokerId = typeof brokerValue === "string" && brokerValue ? brokerValue : null;
  const projectId = typeof projectValue === "string" && projectValue ? projectValue : null;
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/leads?state=error");
  if (brokerId) {
    const { data } = await supabase.from("brokers").select("id").eq("id", brokerId).eq("company_id", companyId).maybeSingle();
    if (!data) redirect("/leads?state=error");
  }
  if (projectId) {
    const { data } = await supabase.from("projects").select("id").eq("id", projectId).eq("company_id", companyId).maybeSingle();
    if (!data) redirect("/leads?state=error");
  }
  const { data, error } = await supabase.from("leads").update({
    full_name: fullName.trim(),
    phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
    email: typeof email === "string" && email.trim() ? email.trim() : null,
    source: typeof source === "string" && source.trim() ? source.trim() : null,
    stage: stageValue as LeadStage,
    assigned_broker_id: brokerId,
    interested_project_id: projectId,
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
  }).eq("id", leadId).eq("company_id", companyId).select("id").maybeSingle();
  if (error || !data) redirect("/leads?state=error");
  revalidatePath("/");
  revalidatePath("/leads");
  redirect("/leads?state=created");
}

export async function createLeadFollowUp(formData: FormData) {
  const leadId = formData.get("lead_id");
  const note = formData.get("note");
  const dueDate = formData.get("due_date");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof leadId !== "string" || !/^[0-9a-f-]{36}$/i.test(leadId) || typeof note !== "string" || note.trim().length < 2 || (typeof dueDate === "string" && dueDate && !isValidFollowUpDate(dueDate))) redirect("/leads?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect(`/leads/${leadId}?state=error`);
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/login");
  const { error } = await supabase.from("lead_follow_ups").insert({
    company_id: companyId,
    lead_id: leadId,
    note: note.trim(),
    due_at: typeof dueDate === "string" && dueDate ? `${dueDate}T00:00:00.000Z` : null,
    created_by: authData.user.id,
  });
  if (error) redirect(`/leads/${leadId}?state=error`);
  revalidatePath(`/leads/${leadId}`);
  redirect(`/leads/${leadId}?state=created`);
}

export async function completeLeadFollowUp(formData: FormData) {
  const leadId = formData.get("lead_id");
  const followUpId = formData.get("follow_up_id");
  const companyId = await getCurrentWritableCompanyId();
  if (!companyId || typeof leadId !== "string" || !/^[0-9a-f-]{36}$/i.test(leadId) || typeof followUpId !== "string" || !/^[0-9a-f-]{36}$/i.test(followUpId)) redirect("/leads?state=error");
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect(`/leads/${leadId}?state=error`);
  const { data, error } = await supabase.from("lead_follow_ups").update({ completed_at: new Date().toISOString() }).eq("id", followUpId).eq("lead_id", leadId).eq("company_id", companyId).is("completed_at", null).select("id").maybeSingle();
  if (error || !data) redirect(`/leads/${leadId}?state=error`);
  revalidatePath(`/leads/${leadId}`);
  redirect(`/leads/${leadId}?state=created`);
}
