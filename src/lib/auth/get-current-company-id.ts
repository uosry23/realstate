import { getCurrentMembership } from "@/lib/auth/get-current-membership";

export async function getCurrentCompanyId(): Promise<string | null> {
  return (await getCurrentMembership())?.companyId ?? null;
}

export async function getCurrentWritableCompanyId(): Promise<string | null> {
  const membership = await getCurrentMembership();
  return membership && membership.role !== "viewer" ? membership.companyId : null;
}
