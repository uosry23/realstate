import type { CompanyRole } from "@/types/database";

export const COMPANY_ROLE_LABELS: Record<CompanyRole, string> = {
  manager: "مدير",
  employee: "موظف",
  viewer: "مشاهدة فقط",
};

export type CompanyMember = {
  id: string;
  full_name: string;
  role: CompanyRole;
  created_at: string;
};

export type CompanyInvitation = {
  id: string;
  invited_email: string;
  role: CompanyRole;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string;
};
