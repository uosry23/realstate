import type { Database, LeadStage } from "@/types/database";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];

export type LeadListItem = Lead & {
  assignedBrokerName: string | null;
  interestedProjectName: string | null;
};

export type LeadFollowUp = Database["public"]["Tables"]["lead_follow_ups"]["Row"];

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new: "جديد",
  follow_up: "متابعة",
  viewing: "معاينة",
  negotiation: "تفاوض",
  won: "تم البيع",
  lost: "خاسر",
};
