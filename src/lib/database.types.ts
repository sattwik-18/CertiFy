export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          file_hash: string
          issued_to: string
          issued_by: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          file_hash: string
          issued_to?: string
          issued_by?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          file_hash?: string
          issued_to?: string
          issued_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      verification_events: {
        Row: {
          id: string
          certificate_id: string | null
          certificate_hash: string
          verifier_user_id: string | null
          verifier_org_name: string | null
          owner_id: string | null
          ip_address: string | null
          geo_country: string | null
          user_agent: string | null
          verified_at: string
          success: boolean
        }
        Insert: {
          id?: string
          certificate_id?: string | null
          certificate_hash: string
          verifier_user_id?: string | null
          verifier_org_name?: string | null
          owner_id?: string | null
          ip_address?: string | null
          geo_country?: string | null
          user_agent?: string | null
          verified_at?: string
          success?: boolean
        }
        Update: {
          id?: string
          certificate_id?: string | null
          certificate_hash?: string
          verifier_user_id?: string | null
          verifier_org_name?: string | null
          owner_id?: string | null
          ip_address?: string | null
          geo_country?: string | null
          user_agent?: string | null
          verified_at?: string
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "verification_events_certificate_id_fkey"
            columns: ["certificate_id"]
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
