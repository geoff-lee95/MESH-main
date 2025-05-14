export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: string | null
          bio: string | null
          website: string | null
          github: string | null
          twitter: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          bio?: string | null
          website?: string | null
          github?: string | null
          twitter?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          bio?: string | null
          website?: string | null
          github?: string | null
          twitter?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          agent_type: string
          capabilities: string[]
          is_public: boolean
          resource_limit: number
          custom_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          agent_type: string
          capabilities?: string[]
          is_public?: boolean
          resource_limit?: number
          custom_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          agent_type?: string
          capabilities?: string[]
          is_public?: boolean
          resource_limit?: number
          custom_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      intents: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          reward: number | null
          status: string
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          reward?: number | null
          status?: string
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          reward?: number | null
          status?: string
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
