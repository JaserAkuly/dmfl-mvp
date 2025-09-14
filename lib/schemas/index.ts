import { z } from 'zod'

// Enums
export const GameStatus = z.enum(['scheduled', 'live', 'final', 'postponed'])
export const PlayerRole = z.enum(['captain', 'co_captain', 'player'])
export const Position = z.enum(['QB', 'WR', 'RB', 'DB', 'LB', 'RUSH', 'FLEX'])

// Base schemas
export const SeasonSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Season name is required'),
  ordinal: z.number().int().positive(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  active: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
})

export const TeamSchema = z.object({
  id: z.string().uuid(),
  season_id: z.string().uuid(),
  name: z.string().min(1, 'Team name is required'),
  slug: z.string().min(1, 'Team slug is required'),
  color_primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  color_secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  logo_url: z.string().url().optional(),
  created_at: z.string().datetime().optional(),
})

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  primary_position: Position.optional(),
  secondary_position: Position.optional(),
  avatar_url: z.string().url().optional(),
  created_at: z.string().datetime().optional(),
})

export const RosterSchema = z.object({
  id: z.string().uuid(),
  season_id: z.string().uuid(),
  team_id: z.string().uuid(),
  player_id: z.string().uuid(),
  jersey_number: z.number().int().min(1).max(99).optional(),
  role: PlayerRole.default('player'),
  created_at: z.string().datetime().optional(),
})

export const GameSchema = z.object({
  id: z.string().uuid(),
  season_id: z.string().uuid(),
  week: z.number().int().positive(),
  kickoff_at: z.string().datetime(),
  location: z.string().optional(),
  status: GameStatus.default('scheduled'),
  home_team_id: z.string().uuid(),
  away_team_id: z.string().uuid(),
  home_score: z.number().int().min(0).default(0),
  away_score: z.number().int().min(0).default(0),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
}).refine((data) => data.home_team_id !== data.away_team_id, {
  message: "Home and away teams must be different",
  path: ["away_team_id"],
})

export const PlayerStatsOffenseSchema = z.object({
  id: z.string().uuid(),
  game_id: z.string().uuid(),
  team_id: z.string().uuid(),
  player_id: z.string().uuid(),
  pass_att: z.number().int().min(0).default(0),
  pass_comp: z.number().int().min(0).default(0),
  pass_yds: z.number().int().default(0),
  pass_tds: z.number().int().min(0).default(0),
  ints_thrown: z.number().int().min(0).default(0),
  rush_att: z.number().int().min(0).default(0),
  rush_yds: z.number().int().default(0),
  rush_tds: z.number().int().min(0).default(0),
  receptions: z.number().int().min(0).default(0),
  targets: z.number().int().min(0).default(0),
  rec_yds: z.number().int().default(0),
  rec_tds: z.number().int().min(0).default(0),
  two_pts: z.number().int().min(0).default(0),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
}).refine((data) => data.pass_comp <= data.pass_att, {
  message: "Completions cannot exceed attempts",
  path: ["pass_comp"],
}).refine((data) => data.receptions <= data.targets, {
  message: "Receptions cannot exceed targets",
  path: ["receptions"],
})

export const PlayerStatsDefenseSchema = z.object({
  id: z.string().uuid(),
  game_id: z.string().uuid(),
  team_id: z.string().uuid(),
  player_id: z.string().uuid(),
  tackles: z.number().int().min(0).default(0),
  sacks: z.number().int().min(0).default(0),
  interceptions: z.number().int().min(0).default(0),
  deflections: z.number().int().min(0).default(0),
  ffumbles: z.number().int().min(0).default(0),
  fr: z.number().int().min(0).default(0),
  safeties: z.number().int().min(0).default(0),
  td: z.number().int().min(0).default(0),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const TeamStatsSchema = z.object({
  id: z.string().uuid(),
  game_id: z.string().uuid(),
  team_id: z.string().uuid(),
  points_for: z.number().int().min(0),
  points_against: z.number().int().min(0),
  turnovers_forced: z.number().int().min(0).default(0),
  turnovers_lost: z.number().int().min(0).default(0),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const ProfileSchema = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().optional(),
  role: z.enum(['admin', 'viewer']).default('viewer'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Input schemas for forms (without generated fields)
export const SeasonInputSchema = SeasonSchema.omit({ 
  id: true, 
  created_at: true 
})

export const TeamInputSchema = TeamSchema.omit({ 
  id: true, 
  created_at: true 
})

export const PlayerInputSchema = PlayerSchema.omit({ 
  id: true, 
  created_at: true 
})

export const RosterInputSchema = RosterSchema.omit({ 
  id: true, 
  created_at: true 
})

export const GameInputSchema = GameSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const PlayerStatsOffenseInputSchema = PlayerStatsOffenseSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const PlayerStatsDefenseInputSchema = PlayerStatsDefenseSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const TeamStatsInputSchema = TeamStatsSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
})

export const ProfileInputSchema = ProfileSchema.omit({ 
  created_at: true, 
  updated_at: true 
})

// Draft import schema
export const DraftImportRowSchema = z.object({
  team_name: z.string().min(1, 'Team name is required'),
  round: z.number().int().positive('Round must be positive'),
  overall_pick: z.number().int().positive('Overall pick must be positive'),
  player_first: z.string().min(1, 'First name is required'),
  player_last: z.string().min(1, 'Last name is required'),
  primary_position: Position,
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

export const DraftImportSchema = z.array(DraftImportRowSchema).min(1, 'At least one player is required')

// Stats entry form schemas
export const GameStatsEntrySchema = z.object({
  game_id: z.string().uuid(),
  home_score: z.number().int().min(0),
  away_score: z.number().int().min(0),
  home_players: z.array(z.object({
    player_id: z.string().uuid(),
    offense: PlayerStatsOffenseInputSchema.partial(),
    defense: PlayerStatsDefenseInputSchema.partial(),
  })),
  away_players: z.array(z.object({
    player_id: z.string().uuid(),
    offense: PlayerStatsOffenseInputSchema.partial(),
    defense: PlayerStatsDefenseInputSchema.partial(),
  })),
})

// Type exports
export type Season = z.infer<typeof SeasonSchema>
export type Team = z.infer<typeof TeamSchema>
export type Player = z.infer<typeof PlayerSchema>
export type Roster = z.infer<typeof RosterSchema>
export type Game = z.infer<typeof GameSchema>
export type PlayerStatsOffense = z.infer<typeof PlayerStatsOffenseSchema>
export type PlayerStatsDefense = z.infer<typeof PlayerStatsDefenseSchema>
export type TeamStats = z.infer<typeof TeamStatsSchema>
export type Profile = z.infer<typeof ProfileSchema>

export type SeasonInput = z.infer<typeof SeasonInputSchema>
export type TeamInput = z.infer<typeof TeamInputSchema>
export type PlayerInput = z.infer<typeof PlayerInputSchema>
export type RosterInput = z.infer<typeof RosterInputSchema>
export type GameInput = z.infer<typeof GameInputSchema>
export type PlayerStatsOffenseInput = z.infer<typeof PlayerStatsOffenseInputSchema>
export type PlayerStatsDefenseInput = z.infer<typeof PlayerStatsDefenseInputSchema>
export type TeamStatsInput = z.infer<typeof TeamStatsInputSchema>
export type ProfileInput = z.infer<typeof ProfileInputSchema>

export type DraftImportRow = z.infer<typeof DraftImportRowSchema>
export type DraftImport = z.infer<typeof DraftImportSchema>
export type GameStatsEntry = z.infer<typeof GameStatsEntrySchema>