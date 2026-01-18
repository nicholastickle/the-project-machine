// Database types for Supabase schema

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
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          archived_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          archived_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          archived_at?: string | null
        }
      }
      plan_snapshots: {
        Row: {
          id: string
          project_id: string
          snapshot_data: Json
          created_at: string
          created_by: string | null
          snapshot_type: string
          summary: string | null
        }
        Insert: {
          id?: string
          project_id: string
          snapshot_data: Json
          created_at?: string
          created_by?: string | null
          snapshot_type?: string
          summary?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          snapshot_data?: Json
          created_at?: string
          created_by?: string | null
          snapshot_type?: string
          summary?: string | null
        }
      }
      reflections: {
        Row: {
          id: string
          project_id: string
          reflection_type: 'start_of_day' | 'end_of_day'
          content: string
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          project_id: string
          reflection_type: 'start_of_day' | 'end_of_day'
          content: string
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          reflection_type?: 'start_of_day' | 'end_of_day'
          content?: string
          created_at?: string
          created_by?: string | null
        }
      }
      reference_notes: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      file_summaries: {
        Row: {
          id: string
          project_id: string
          filename: string
          file_type: string | null
          summary: string
          confirmed_at: string
          confirmed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          filename: string
          file_type?: string | null
          summary: string
          confirmed_at?: string
          confirmed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          filename?: string
          file_type?: string | null
          summary?: string
          confirmed_at?: string
          confirmed_by?: string | null
          created_at?: string
        }
      }
      project_members: {
        Row: {
          project_id: string
          user_id: string
          role: 'editor' | 'viewer'
          joined_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          role?: 'editor' | 'viewer'
          joined_at?: string
        }
        Update: {
          project_id?: string
          user_id?: string
          role?: 'editor' | 'viewer'
          joined_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          project_id: string | null
          user_id: string | null
          event_type: string
          event_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          event_type: string
          event_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          event_type?: string
          event_data?: Json | null
          created_at?: string
        }
      }
    }
  }
}

// Convenience types
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type PlanSnapshot = Database['public']['Tables']['plan_snapshots']['Row']
export type PlanSnapshotInsert = Database['public']['Tables']['plan_snapshots']['Insert']

export type Reflection = Database['public']['Tables']['reflections']['Row']
export type ReflectionInsert = Database['public']['Tables']['reflections']['Insert']

export type ReferenceNote = Database['public']['Tables']['reference_notes']['Row']
export type ReferenceNoteInsert = Database['public']['Tables']['reference_notes']['Insert']
export type ReferenceNoteUpdate = Database['public']['Tables']['reference_notes']['Update']

export type FileSummary = Database['public']['Tables']['file_summaries']['Row']
export type FileSummaryInsert = Database['public']['Tables']['file_summaries']['Insert']

export type ProjectMember = Database['public']['Tables']['project_members']['Row']
export type ProjectMemberInsert = Database['public']['Tables']['project_members']['Insert']

export type UsageLog = Database['public']['Tables']['usage_logs']['Row']
export type UsageLogInsert = Database['public']['Tables']['usage_logs']['Insert']
