export type Json = string | number | boolean | null | Json[] | { [key: string]: Json | undefined };

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "agent" | "manager";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin" | "agent" | "manager";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "admin" | "agent" | "manager";
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          name: string;
          type: "outbound" | "inbound" | "blended";
          status: "active" | "paused" | "completed";
          settings: Json | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: "outbound" | "inbound" | "blended";
          status?: "active" | "paused" | "completed";
          settings?: Json | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          type?: "outbound" | "inbound" | "blended";
          status?: "active" | "paused" | "completed";
          settings?: Json | null;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          company: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          status: "new" | "contacted" | "interested" | "not_interested" | "callback" | "converted" | "do_not_contact";
          source: string | null;
          campaign_id: string | null;
          assigned_to: string | null;
          tags: string[] | null;
          notes: string | null;
          dnc: boolean;
          last_called_at: string | null;
          call_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          company?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          status?: "new" | "contacted" | "interested" | "not_interested" | "callback" | "converted" | "do_not_contact";
          source?: string | null;
          campaign_id?: string | null;
          assigned_to?: string | null;
          tags?: string[] | null;
          notes?: string | null;
          dnc?: boolean;
          last_called_at?: string | null;
          call_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          company?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          status?: "new" | "contacted" | "interested" | "not_interested" | "callback" | "converted" | "do_not_contact";
          source?: string | null;
          campaign_id?: string | null;
          assigned_to?: string | null;
          tags?: string[] | null;
          notes?: string | null;
          dnc?: boolean;
          last_called_at?: string | null;
          call_count?: number;
          updated_at?: string;
        };
      };
      call_scripts: {
        Row: {
          id: string;
          title: string;
          category: string;
          content: string;
          objection_responses: Json | null;
          campaign_id: string | null;
          created_by: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category?: string;
          content?: string;
          objection_responses?: Json | null;
          campaign_id?: string | null;
          created_by?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          category?: string;
          content?: string;
          objection_responses?: Json | null;
          campaign_id?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      call_logs: {
        Row: {
          id: string;
          lead_id: string | null;
          user_id: string | null;
          campaign_id: string | null;
          direction: "outbound" | "inbound";
          outcome: "no_answer" | "answered" | "busy" | "voicemail" | "dnc" | "wrong_number" | "disconnected";
          duration_seconds: number;
          recording_url: string | null;
          notes: string | null;
          transcript: string | null;
          sip_call_id: string | null;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id?: string | null;
          user_id?: string | null;
          campaign_id?: string | null;
          direction?: "outbound" | "inbound";
          outcome?: "no_answer" | "answered" | "busy" | "voicemail" | "dnc" | "wrong_number" | "disconnected";
          duration_seconds?: number;
          recording_url?: string | null;
          notes?: string | null;
          transcript?: string | null;
          sip_call_id?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: {
          outcome?: "no_answer" | "answered" | "busy" | "voicemail" | "dnc" | "wrong_number" | "disconnected";
          duration_seconds?: number;
          recording_url?: string | null;
          notes?: string | null;
          transcript?: string | null;
          sip_call_id?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
        };
      };
      appointments: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string;
          scheduled_at: string;
          duration_minutes: number;
          type: "sales_call" | "demo" | "follow_up" | "consultation" | "check_in";
          status: "scheduled" | "completed" | "cancelled" | "rescheduled";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id: string;
          scheduled_at: string;
          duration_minutes?: number;
          type?: "sales_call" | "demo" | "follow_up" | "consultation" | "check_in";
          status?: "scheduled" | "completed" | "cancelled" | "rescheduled";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          scheduled_at?: string;
          duration_minutes?: number;
          type?: "sales_call" | "demo" | "follow_up" | "consultation" | "check_in";
          status?: "scheduled" | "completed" | "cancelled" | "rescheduled";
          notes?: string | null;
          updated_at?: string;
        };
      };
      dnc_list: {
        Row: {
          id: string;
          phone: string;
          reason: string | null;
          source: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          reason?: string | null;
          source?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      lead_status: "new" | "contacted" | "interested" | "not_interested" | "callback" | "converted" | "do_not_contact";
      appointment_status: "scheduled" | "completed" | "cancelled" | "rescheduled";
      call_outcome: "no_answer" | "answered" | "busy" | "voicemail" | "dnc" | "wrong_number" | "disconnected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};