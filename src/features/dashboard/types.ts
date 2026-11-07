import type { UnitStatus } from "@/types/database";

export type OperationalSummary = {
  projectCount: number;
  unitCount: number;
  unitCountsByStatus: Record<UnitStatus, number>;
  leadCount: number;
  publicInterestLeadCount: number;
  brokerCount: number;
  openServiceRequestCount: number;
};
