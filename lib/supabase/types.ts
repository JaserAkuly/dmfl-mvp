export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor: string | null
          after: Json | null
          before: Json | null
          created_at: string | null
          entity: string
          entity_id: string
          id: string
        }
        Insert: {
          action: string
          actor?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string | null
          entity: string
          entity_id: string
          id?: string
        }
        Update: {
          action?: string
          actor?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string | null
          entity?: string
          entity_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_fkey"
            columns: ["actor"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      games: {
        Row: {
          away_score: number | null
          away_team_id: string
          created_at: string | null
          home_score: number | null
          home_team_id: string
          id: string
          kickoff_at: string
          location: string | null
          season_id: string
          status: Database["public"]["Enums"]["game_status"]
          updated_at: string | null
          week: number
        }
        Insert: {
          away_score?: number | null
          away_team_id: string
          created_at?: string | null
          home_score?: number | null
          home_team_id: string
          id?: string
          kickoff_at: string
          location?: string | null
          season_id: string
          status?: Database["public"]["Enums"]["game_status"]
          updated_at?: string | null
          week: number
        }
        Update: {
          away_score?: number | null
          away_team_id?: string
          created_at?: string | null
          home_score?: number | null
          home_team_id?: string
          id?: string
          kickoff_at?: string
          location?: string | null
          season_id?: string
          status?: Database["public"]["Enums"]["game_status"]
          updated_at?: string | null
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "games_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          }
        ]
      }
      player_stats_defense: {
        Row: {
          created_at: string | null
          deflections: number | null
          ffumbles: number | null
          fr: number | null
          game_id: string
          id: string
          interceptions: number | null
          player_id: string
          sacks: number | null
          safeties: number | null
          tackles: number | null
          td: number | null
          team_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deflections?: number | null
          ffumbles?: number | null
          fr?: number | null
          game_id: string
          id?: string
          interceptions?: number | null
          player_id: string
          sacks?: number | null
          safeties?: number | null
          tackles?: number | null
          td?: number | null
          team_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deflections?: number | null
          ffumbles?: number | null
          fr?: number | null
          game_id?: string
          id?: string
          interceptions?: number | null
          player_id?: string
          sacks?: number | null
          safeties?: number | null
          tackles?: number | null
          td?: number | null
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_defense_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_defense_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_defense_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      player_stats_offense: {
        Row: {
          created_at: string | null
          game_id: string
          id: string
          ints_thrown: number | null
          pass_att: number | null
          pass_comp: number | null
          pass_tds: number | null
          pass_yds: number | null
          player_id: string
          rec_tds: number | null
          rec_yds: number | null
          receptions: number | null
          rush_att: number | null
          rush_tds: number | null
          rush_yds: number | null
          targets: number | null
          team_id: string
          two_pts: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game_id: string
          id?: string
          ints_thrown?: number | null
          pass_att?: number | null
          pass_comp?: number | null
          pass_tds?: number | null
          pass_yds?: number | null
          player_id: string
          rec_tds?: number | null
          rec_yds?: number | null
          receptions?: number | null
          rush_att?: number | null
          rush_tds?: number | null
          rush_yds?: number | null
          targets?: number | null
          team_id: string
          two_pts?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: string
          id?: string
          ints_thrown?: number | null
          pass_att?: number | null
          pass_comp?: number | null
          pass_tds?: number | null
          pass_yds?: number | null
          player_id?: string
          rec_tds?: number | null
          rec_yds?: number | null
          receptions?: number | null
          rush_att?: number | null
          rush_tds?: number | null
          rush_yds?: number | null
          targets?: number | null
          team_id?: string
          two_pts?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_offense_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_offense_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_offense_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      players: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          primary_position: Database["public"]["Enums"]["player_position"] | null
          secondary_position: Database["public"]["Enums"]["player_position"] | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          primary_position?: Database["public"]["Enums"]["player_position"] | null
          secondary_position?: Database["public"]["Enums"]["player_position"] | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          primary_position?: Database["public"]["Enums"]["player_position"] | null
          secondary_position?: Database["public"]["Enums"]["player_position"] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rosters: {
        Row: {
          created_at: string | null
          id: string
          jersey_number: number | null
          player_id: string
          role: Database["public"]["Enums"]["player_role"]
          season_id: string
          team_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          jersey_number?: number | null
          player_id: string
          role?: Database["public"]["Enums"]["player_role"]
          season_id: string
          team_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          jersey_number?: number | null
          player_id?: string
          role?: Database["public"]["Enums"]["player_role"]
          season_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      seasons: {
        Row: {
          active: boolean | null
          created_at: string | null
          end_date: string
          id: string
          name: string
          ordinal: number
          start_date: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          end_date: string
          id?: string
          name: string
          ordinal: number
          start_date: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          end_date?: string
          id?: string
          name?: string
          ordinal?: number
          start_date?: string
        }
        Relationships: []
      }
      team_stats: {
        Row: {
          created_at: string | null
          game_id: string
          id: string
          points_against: number
          points_for: number
          team_id: string
          turnovers_forced: number | null
          turnovers_lost: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game_id: string
          id?: string
          points_against: number
          points_for: number
          team_id: string
          turnovers_forced?: number | null
          turnovers_lost?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: string
          id?: string
          points_against?: number
          points_for?: number
          team_id?: string
          turnovers_forced?: number | null
          turnovers_lost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_stats_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          color_primary: string
          color_secondary: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          season_id: string
          slug: string
        }
        Insert: {
          color_primary: string
          color_secondary?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          season_id: string
          slug: string
        }
        Update: {
          color_primary?: string
          color_secondary?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          season_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      v_leaderboards: {
        Row: {
          category: string | null
          first_name: string | null
          games_played: number | null
          last_name: string | null
          player_id: string | null
          primary_position: Database["public"]["Enums"]["player_position"] | null
          season_id: string | null
          season_name: string | null
          stat_value: number | null
          team_id: string | null
          team_name: string | null
          type: string | null
          week: number | null
        }
        Relationships: []
      }
      v_player_season_defense: {
        Row: {
          defensive_tds: number | null
          deflections: number | null
          ffumbles: number | null
          first_name: string | null
          fr: number | null
          games_played: number | null
          interceptions: number | null
          last_name: string | null
          player_id: string | null
          primary_position: Database["public"]["Enums"]["player_position"] | null
          sacks: number | null
          safeties: number | null
          season_id: string | null
          season_name: string | null
          tackles: number | null
          team_id: string | null
          team_name: string | null
          week: number | null
        }
        Relationships: []
      }
      v_player_season_offense: {
        Row: {
          catch_pct: number | null
          first_name: string | null
          games_played: number | null
          ints_thrown: number | null
          last_name: string | null
          pass_att: number | null
          pass_comp: number | null
          pass_comp_pct: number | null
          pass_tds: number | null
          pass_yds: number | null
          player_id: string | null
          primary_position: Database["public"]["Enums"]["player_position"] | null
          rec_avg: number | null
          rec_tds: number | null
          rec_yds: number | null
          receptions: number | null
          rush_att: number | null
          rush_avg: number | null
          rush_tds: number | null
          rush_yds: number | null
          season_id: string | null
          season_name: string | null
          targets: number | null
          team_id: string | null
          team_name: string | null
          total_tds: number | null
          two_pts: number | null
          week: number | null
        }
        Relationships: []
      }
      v_team_standings: {
        Row: {
          avg_points_against: number | null
          avg_points_for: number | null
          games_played: number | null
          losses: number | null
          point_diff: number | null
          points_against: number | null
          points_for: number | null
          season_id: string | null
          team_id: string | null
          team_name: string | null
          team_slug: string | null
          ties: number | null
          win_pct: number | null
          wins: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      refresh_materialized_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      game_status: "scheduled" | "live" | "final" | "postponed"
      player_role: "captain" | "co_captain" | "player"
      player_position: "QB" | "WR" | "RB" | "DB" | "LB" | "RUSH" | "FLEX"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}