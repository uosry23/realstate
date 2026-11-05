import type { Database, UnitStatus } from "@/types/database";

export type Unit = Database["public"]["Tables"]["units"]["Row"];

export type UnitListItem = Unit & {
  projectName: string | null;
};

export type UnitStatusEvent = Database["public"]["Tables"]["unit_status_events"]["Row"];

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  available: "متاحة",
  reserved: "محجوزة",
  sold: "مباعة",
};
