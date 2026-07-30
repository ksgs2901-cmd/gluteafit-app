export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string
          default_duration_seconds: number
          equipment: Database["public"]["Enums"]["equipment_type"]
          id: string
          image_url: string | null
          instructions: string
          muscle_focus: string[]
          name: string
          slug: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          default_duration_seconds?: number
          equipment?: Database["public"]["Enums"]["equipment_type"]
          id?: string
          image_url?: string | null
          instructions?: string
          muscle_focus?: string[]
          name: string
          slug: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          default_duration_seconds?: number
          equipment?: Database["public"]["Enums"]["equipment_type"]
          id?: string
          image_url?: string | null
          instructions?: string
          muscle_focus?: string[]
          name?: string
          slug?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_streak: number
          display_name: string | null
          id: string
          last_workout_at: string | null
          level: Database["public"]["Enums"]["fitness_level"]
          longest_streak: number
          total_minutes: number
          total_sessions: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          display_name?: string | null
          id: string
          last_workout_at?: string | null
          level?: Database["public"]["Enums"]["fitness_level"]
          longest_streak?: number
          total_minutes?: number
          total_sessions?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          display_name?: string | null
          id?: string
          last_workout_at?: string | null
          level?: Database["public"]["Enums"]["fitness_level"]
          longest_streak?: number
          total_minutes?: number
          total_sessions?: number
          updated_at?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          duration_seconds: number | null
          exercise_id: string
          id: string
          position: number
          rest_seconds: number
          workout_id: string
        }
        Insert: {
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          position: number
          rest_seconds?: number
          workout_id: string
        }
        Update: {
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          position?: number
          rest_seconds?: number
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          completed_at: string
          duration_seconds: number
          id: string
          user_id: string
          workout_id: string
        }
        Insert: {
          completed_at?: string
          duration_seconds: number
          id?: string
          user_id: string
          workout_id: string
        }
        Update: {
          completed_at?: string
          duration_seconds?: number
          id?: string
          user_id?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          cover_color: string
          created_at: string
          description: string
          estimated_minutes: number
          id: string
          is_published: boolean
          level: Database["public"]["Enums"]["fitness_level"]
          slug: string
          sort_order: number
          title: string
        }
        Insert: {
          cover_color?: string
          created_at?: string
          description?: string
          estimated_minutes?: number
          id?: string
          is_published?: boolean
          level: Database["public"]["Enums"]["fitness_level"]
          slug: string
          sort_order?: number
          title: string
        }
        Update: {
          cover_color?: string
          created_at?: string
          description?: string
          estimated_minutes?: number
          id?: string
          is_published?: boolean
          level?: Database["public"]["Enums"]["fitness_level"]
          slug?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      equipment_type:
        | "nenhum"
        | "halteres"
        | "banda_resistencia"
        | "kettlebell"
        | "step"
      fitness_level: "iniciante" | "intermediario" | "avancado"
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

export const Constants = {
  public: {
    Enums: {
      equipment_type: [
        "nenhum",
        "halteres",
        "banda_resistencia",
        "kettlebell",
        "step",
      ],
      fitness_level: ["iniciante", "intermediario", "avancado"],
    },
  },
} as const
