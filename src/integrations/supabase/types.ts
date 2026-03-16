export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          source_references: Json | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          source_references?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          source_references?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          preferred_language: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_language?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_language?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminder_logs: {
        Row: {
          channel: string
          content_type: string
          id: string
          sent_at: string
          status: string
          user_id: string
        }
        Insert: {
          channel: string
          content_type?: string
          id?: string
          sent_at?: string
          status?: string
          user_id: string
        }
        Update: {
          channel?: string
          content_type?: string
          id?: string
          sent_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          user_id: string
          plan: string
          status: string
          trial_ends_at: string | null
          current_period_end: string | null
          razorpay_subscription_id: string | null
          razorpay_payment_id: string | null
          family_owner_id: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          user_id: string
          plan?: string
          status?: string
          trial_ends_at?: string | null
          current_period_end?: string | null
          razorpay_subscription_id?: string | null
          razorpay_payment_id?: string | null
          family_owner_id?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          plan?: string
          status?: string
          trial_ends_at?: string | null
          current_period_end?: string | null
          razorpay_subscription_id?: string | null
          razorpay_payment_id?: string | null
          family_owner_id?: string | null
          updated_at?: string
          created_at?: string
        }
        Relationships: []
      }
      usage_logs: {
        Row: {
          user_id: string
          feature: string
          date_ist: string
          count: number
          updated_at: string
        }
        Insert: {
          user_id: string
          feature: string
          date_ist: string
          count?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          feature?: string
          date_ist?: string
          count?: number
          updated_at?: string
        }
        Relationships: []
      }
      kundli_analyses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          date_of_birth: string
          time_of_birth: string | null
          city: string | null
          state: string | null
          country: string | null
          lens: string
          result: string | null
          is_free: boolean
          razorpay_payment_id: string | null
          payment_status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          date_of_birth: string
          time_of_birth?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          lens: string
          result?: string | null
          is_free?: boolean
          razorpay_payment_id?: string | null
          payment_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          date_of_birth?: string
          time_of_birth?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          lens?: string
          result?: string | null
          is_free?: boolean
          razorpay_payment_id?: string | null
          payment_status?: string
          created_at?: string
        }
        Relationships: []
      }
      puja_records: {
        Row: {
          user_id: string
          date_key: string
          item_states: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          date_key: string
          item_states: Json
          updated_at?: string
        }
        Update: {
          user_id?: string
          date_key?: string
          item_states?: Json
          updated_at?: string
        }
        Relationships: []
      }
      scripture_bookmarks: {
        Row: {
          user_id: string
          scripture_type: string
          bookmark_ids: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          scripture_type: string
          bookmark_ids: Json
          updated_at?: string
        }
        Update: {
          user_id?: string
          scripture_type?: string
          bookmark_ids?: Json
          updated_at?: string
        }
        Relationships: []
      }
      scriptures: {
        Row: {
          id: string
          name: string
          name_sanskrit: string | null
          tradition: string | null
          category: string
          total_verses: number
          total_chapters: number
          summary: string | null
          cover_gradient: string | null
          accent_color: string | null
          is_free: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          name_sanskrit?: string | null
          tradition?: string | null
          category?: string
          total_verses?: number
          total_chapters?: number
          summary?: string | null
          cover_gradient?: string | null
          accent_color?: string | null
          is_free?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_sanskrit?: string | null
          tradition?: string | null
          category?: string
          total_verses?: number
          total_chapters?: number
          summary?: string | null
          cover_gradient?: string | null
          accent_color?: string | null
          is_free?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      scripture_chapters: {
        Row: {
          id: string
          scripture_id: string
          number: number
          title: string
          subtitle: string | null
          summary: string | null
          total_verses: number
          is_free: boolean
          sort_order: number
        }
        Insert: {
          id: string
          scripture_id: string
          number: number
          title: string
          subtitle?: string | null
          summary?: string | null
          total_verses?: number
          is_free?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          scripture_id?: string
          number?: number
          title?: string
          subtitle?: string | null
          summary?: string | null
          total_verses?: number
          is_free?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "scripture_chapters_scripture_id_fkey"
            columns: ["scripture_id"]
            isOneToOne: false
            referencedRelation: "scriptures"
            referencedColumns: ["id"]
          },
        ]
      }
      scripture_verses: {
        Row: {
          id: string
          scripture_id: string
          chapter_id: string
          verse_number: number
          sanskrit: string
          transliteration: string | null
          meaning: string
          word_meanings: string | null
          is_key_verse: boolean
          sort_order: number
        }
        Insert: {
          id: string
          scripture_id: string
          chapter_id: string
          verse_number: number
          sanskrit: string
          transliteration?: string | null
          meaning: string
          word_meanings?: string | null
          is_key_verse?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          scripture_id?: string
          chapter_id?: string
          verse_number?: number
          sanskrit?: string
          transliteration?: string | null
          meaning?: string
          word_meanings?: string | null
          is_key_verse?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "scripture_verses_scripture_id_fkey"
            columns: ["scripture_id"]
            isOneToOne: false
            referencedRelation: "scriptures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripture_verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "scripture_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_preferences: {
        Row: {
          channel: string
          created_at: string
          enabled: boolean
          id: string
          include_festivals: boolean
          include_shloka: boolean
          language: string
          reminder_time: string
          timezone: string
          updated_at: string
          user_id: string
          whatsapp_number: string | null
        }
        Insert: {
          channel?: string
          created_at?: string
          enabled?: boolean
          id?: string
          include_festivals?: boolean
          include_shloka?: boolean
          language?: string
          reminder_time?: string
          timezone?: string
          updated_at?: string
          user_id: string
          whatsapp_number?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          enabled?: boolean
          id?: string
          include_festivals?: boolean
          include_shloka?: boolean
          language?: string
          reminder_time?: string
          timezone?: string
          updated_at?: string
          user_id?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_usage: {
        Args: {
          p_user_id: string
          p_feature: string
          p_date_ist: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
