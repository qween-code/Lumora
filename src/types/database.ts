export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserTier = 'FREE' | 'CREATOR' | 'PRO' | 'ENTERPRISE'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused'
export type GenerationType = 'image' | 'video' | 'audio' | '3d'
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type CreditTransactionType = 'purchase' | 'generation' | 'refund' | 'referral' | 'bonus' | 'subscription'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          tier: UserTier
          credits_balance: number
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_email_verified: boolean
          stripe_customer_id: string | null
          metadata: Json
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          tier?: UserTier
          credits_balance?: number
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_email_verified?: boolean
          stripe_customer_id?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          tier?: UserTier
          credits_balance?: number
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_email_verified?: boolean
          stripe_customer_id?: string | null
          metadata?: Json
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: UserTier
          status: SubscriptionStatus
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: UserTier
          status: SubscriptionStatus
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: UserTier
          status?: SubscriptionStatus
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          balance_after: number
          type: CreditTransactionType
          reference_id: string | null
          description: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          balance_after: number
          type: CreditTransactionType
          reference_id?: string | null
          description?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          balance_after?: number
          type?: CreditTransactionType
          reference_id?: string | null
          description?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          owner_id: string
          tier: UserTier
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          tier: UserTier
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          tier?: UserTier
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          role: WorkspaceRole
          joined_at: string
        }
        Insert: {
          workspace_id: string
          user_id: string
          role: WorkspaceRole
          joined_at?: string
        }
        Update: {
          workspace_id?: string
          user_id?: string
          role?: WorkspaceRole
          joined_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          workspace_id: string | null
          type: GenerationType
          model: string
          prompt: string
          negative_prompt: string | null
          parameters: Json
          status: GenerationStatus
          output_urls: string[] | null
          credits_used: number
          generation_time_ms: number | null
          error_message: string | null
          provider: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id?: string | null
          type: GenerationType
          model: string
          prompt: string
          negative_prompt?: string | null
          parameters?: Json
          status?: GenerationStatus
          output_urls?: string[] | null
          credits_used: number
          generation_time_ms?: number | null
          error_message?: string | null
          provider?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string | null
          type?: GenerationType
          model?: string
          prompt?: string
          negative_prompt?: string | null
          parameters?: Json
          status?: GenerationStatus
          output_urls?: string[] | null
          credits_used?: number
          generation_time_ms?: number | null
          error_message?: string | null
          provider?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          type: GenerationType
          thumbnail_url: string | null
          creator_id: string | null
          is_public: boolean
          is_featured: boolean
          prompt_template: string
          parameters: Json
          usage_count: number
          rating: number
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          type: GenerationType
          thumbnail_url?: string | null
          creator_id?: string | null
          is_public?: boolean
          is_featured?: boolean
          prompt_template: string
          parameters?: Json
          usage_count?: number
          rating?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          type?: GenerationType
          thumbnail_url?: string | null
          creator_id?: string | null
          is_public?: boolean
          is_featured?: boolean
          prompt_template?: string
          parameters?: Json
          usage_count?: number
          rating?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          generation_id: string | null
          event_type: string
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          generation_id?: string | null
          event_type: string
          event_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          generation_id?: string | null
          event_type?: string
          event_data?: Json
          created_at?: string
        }
      }
    }
    Functions: {
      deduct_credits: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: CreditTransactionType
          p_reference_id?: string | null
          p_description?: string | null
        }
        Returns: boolean
      }
      add_credits: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: CreditTransactionType
          p_reference_id?: string | null
          p_description?: string | null
        }
        Returns: boolean
      }
    }
  }
}
