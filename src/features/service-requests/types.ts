import type {
  Database,
  ServiceRequestStatus,
  ServiceRequestType,
} from "@/types/database";

export type ServiceRequest =
  Database["public"]["Tables"]["service_requests"]["Row"];

export type ServiceRequestListItem = ServiceRequest & {
  unitCode: string | null;
};

export const SERVICE_REQUEST_TYPE_LABELS: Record<ServiceRequestType, string> = {
  after_sales: "ما بعد البيع",
  maintenance: "صيانة",
};

export const SERVICE_REQUEST_STATUS_LABELS: Record<
  ServiceRequestStatus,
  string
> = {
  open: "مفتوح",
  in_progress: "قيد التنفيذ",
  resolved: "محلول",
  closed: "مغلق",
};
