export type UnitStatus = "available" | "reserved" | "sold";
export type LeadStage =
  | "new"
  | "follow_up"
  | "viewing"
  | "negotiation"
  | "won"
  | "lost";
export type ServiceRequestType = "after_sales" | "maintenance";
export type ServiceRequestStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";
export type CompanyRole = "manager" | "employee" | "viewer";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

type CompanyRow = {
  id: string;
  name: string;
} & Timestamps;

type ProfileRow = {
  id: string;
  company_id: string;
  full_name: string;
  role: CompanyRole;
} & Timestamps;

type CompanyInvitationRow = {
  id: string;
  company_id: string;
  invited_email: string;
  role: CompanyRole;
  token_hash: string;
  created_by: string;
  accepted_user_id: string | null;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

type ProjectRow = {
  id: string;
  company_id: string;
  name: string;
  location: string | null;
  description: string | null;
} & Timestamps;

type UnitRow = {
  id: string;
  company_id: string;
  project_id: string;
  code: string;
  unit_type: string | null;
  floor: string | null;
  area_sqm: number | null;
  status: UnitStatus;
} & Timestamps;

type UnitStatusEventRow = {
  id: string;
  company_id: string;
  unit_id: string;
  from_status: UnitStatus | null;
  to_status: UnitStatus;
  changed_by: string | null;
  changed_at: string;
  note: string | null;
};

type BrokerRow = {
  id: string;
  company_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
} & Timestamps;

type LeadRow = {
  id: string;
  company_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  stage: LeadStage;
  assigned_broker_id: string | null;
  interested_project_id: string | null;
  notes: string | null;
} & Timestamps;

type LeadFollowUpRow = {
  id: string;
  company_id: string;
  lead_id: string;
  note: string;
  due_at: string | null;
  completed_at: string | null;
  created_by: string;
} & Timestamps;

type ServiceRequestRow = {
  id: string;
  company_id: string;
  unit_id: string | null;
  request_type: ServiceRequestType;
  title: string;
  description: string | null;
  status: ServiceRequestStatus;
} & Timestamps;

type ForeignKey = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDefinition<
  Row,
  Insert,
  Update,
  Relationships extends ForeignKey[] = [],
> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export type Database = {
  public: {
    Tables: {
      companies: TableDefinition<
        CompanyRow,
        Omit<CompanyRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<CompanyRow>
      >;
      profiles: TableDefinition<
        ProfileRow,
        Omit<ProfileRow, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        },
        Partial<Omit<ProfileRow, "id">>
      >;
      company_invitations: TableDefinition<
        CompanyInvitationRow,
        Omit<CompanyInvitationRow, "id" | "created_at" | "accepted_at" | "accepted_user_id" | "revoked_at"> & {
          id?: string;
          created_at?: string;
          accepted_at?: string | null;
          accepted_user_id?: string | null;
          revoked_at?: string | null;
        },
        Partial<Omit<CompanyInvitationRow, "id" | "company_id" | "created_by" | "token_hash">>
      >;
      projects: TableDefinition<
        ProjectRow,
        Omit<ProjectRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        },
        Partial<Omit<ProjectRow, "id" | "company_id">>
      >;
      units: TableDefinition<
        UnitRow,
        Omit<UnitRow, "id" | "created_at" | "updated_at" | "status"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          status?: UnitStatus;
        },
        Partial<Omit<UnitRow, "id" | "company_id">>,
        [
          {
            foreignKeyName: "units_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "units_project_company_fkey";
            columns: ["project_id", "company_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id", "company_id"];
          },
        ]
      >;
      unit_status_events: TableDefinition<
        UnitStatusEventRow,
        Omit<UnitStatusEventRow, "id" | "changed_at"> & {
          id?: string;
          changed_at?: string;
        },
        never,
        [
          {
            foreignKeyName: "unit_status_events_unit_id_fkey";
            columns: ["unit_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "unit_status_events_unit_company_fkey";
            columns: ["unit_id", "company_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id", "company_id"];
          },
        ]
      >;
      brokers: TableDefinition<
        BrokerRow,
        Omit<BrokerRow, "id" | "created_at" | "updated_at" | "is_active"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        },
        Partial<Omit<BrokerRow, "id" | "company_id">>
      >;
      leads: TableDefinition<
        LeadRow,
        Omit<LeadRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          stage?: LeadStage;
        },
        Partial<Omit<LeadRow, "id" | "company_id">>,
        [
          {
            foreignKeyName: "leads_assigned_broker_id_fkey";
            columns: ["assigned_broker_id"];
            isOneToOne: false;
            referencedRelation: "brokers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_interested_project_id_fkey";
            columns: ["interested_project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_broker_company_fkey";
            columns: ["assigned_broker_id", "company_id"];
            isOneToOne: false;
            referencedRelation: "brokers";
            referencedColumns: ["id", "company_id"];
          },
          {
            foreignKeyName: "leads_project_company_fkey";
            columns: ["interested_project_id", "company_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id", "company_id"];
          },
        ]
      >;
      lead_follow_ups: TableDefinition<
        LeadFollowUpRow,
        Omit<LeadFollowUpRow, "id" | "created_at" | "updated_at" | "completed_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          due_at?: string | null;
          completed_at?: string | null;
        },
        Partial<Omit<LeadFollowUpRow, "id" | "company_id" | "lead_id" | "created_by">>,
        [
          {
            foreignKeyName: "lead_follow_ups_lead_company_fkey";
            columns: ["lead_id", "company_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id", "company_id"];
          },
          {
            foreignKeyName: "lead_follow_ups_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ]
      >;
      service_requests: TableDefinition<
        ServiceRequestRow,
        Omit<ServiceRequestRow, "id" | "created_at" | "updated_at" | "status"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          status?: ServiceRequestStatus;
        },
        Partial<Omit<ServiceRequestRow, "id" | "company_id">>,
        [
          {
            foreignKeyName: "service_requests_unit_id_fkey";
            columns: ["unit_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_requests_unit_company_fkey";
            columns: ["unit_id", "company_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id", "company_id"];
          },
        ]
      >;
    };
    Views: Record<string, never>;
    Functions: {
      current_company_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      current_company_role: {
        Args: Record<string, never>;
        Returns: CompanyRole | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
