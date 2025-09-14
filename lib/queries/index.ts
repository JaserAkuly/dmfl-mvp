import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type Tables = Database['public']['Tables']
type Views = Database['public']['Views']

// Season queries
export async function getActiveSeason() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('active', true)
    .single()
  
  if (error) throw error
  return data
}

export async function getSeasons() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('ordinal', { ascending: false })
  
  if (error) throw error
  return data
}

// Team queries
export async function getTeams(seasonId?: string) {
  const supabase = createClient()
  let query = supabase
    .from('teams')
    .select('*')
    .order('name')
  
  if (seasonId) {
    query = query.eq('season_id', seasonId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getTeamBySlug(slug: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

// Player queries
export async function getPlayers(filters?: {
  teamId?: string
  position?: string
  search?: string
}) {
  const supabase = createClient()
  let query = supabase
    .from('players')
    .select(`
      *,
      rosters!inner (
        team_id,
        jersey_number,
        role,
        teams (
          name,
          slug
        )
      )
    `)
    .order('last_name')
  
  if (filters?.position) {
    query = query.eq('primary_position', filters.position)
  }
  
  if (filters?.teamId) {
    query = query.eq('rosters.team_id', filters.teamId)
  }
  
  if (filters?.search) {
    query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getPlayerById(playerId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      rosters (
        team_id,
        jersey_number,
        role,
        season_id,
        teams (
          name,
          slug,
          color_primary
        )
      )
    `)
    .eq('id', playerId)
    .single()
  
  if (error) throw error
  return data
}

// Game queries
export async function getGames(filters?: {
  seasonId?: string
  week?: number
  status?: string
  teamId?: string
}) {
  const supabase = createClient()
  let query = supabase
    .from('games')
    .select(`
      *,
      home_team:teams!home_team_id (
        id,
        name,
        slug,
        color_primary,
        logo_url
      ),
      away_team:teams!away_team_id (
        id,
        name,
        slug,
        color_primary,
        logo_url
      ),
      seasons (
        name
      )
    `)
    .order('kickoff_at')
  
  if (filters?.seasonId) {
    query = query.eq('season_id', filters.seasonId)
  }
  
  if (filters?.week) {
    query = query.eq('week', filters.week)
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters?.teamId) {
    query = query.or(`home_team_id.eq.${filters.teamId},away_team_id.eq.${filters.teamId}`)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getGameById(gameId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      home_team:teams!home_team_id (
        id,
        name,
        slug,
        color_primary,
        logo_url
      ),
      away_team:teams!away_team_id (
        id,
        name,
        slug,
        color_primary,
        logo_url
      ),
      seasons (
        name
      )
    `)
    .eq('id', gameId)
    .single()
  
  if (error) throw error
  return data
}

// Team standings
export async function getTeamStandings(seasonId?: string) {
  const supabase = createClient()
  let query = supabase
    .from('v_team_standings')
    .select('*')
    .order('win_pct', { ascending: false })
    .order('point_diff', { ascending: false })
  
  if (seasonId) {
    query = query.eq('season_id', seasonId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// Leaderboards
export async function getLeaderboards(filters?: {
  category?: string
  type?: 'offense' | 'defense'
  seasonId?: string
  week?: number
  limit?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('v_leaderboards')
    .select('*')
    .order('stat_value', { ascending: false })
  
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.type) {
    query = query.eq('type', filters.type)
  }
  
  if (filters?.seasonId) {
    query = query.eq('season_id', filters.seasonId)
  }
  
  if (filters?.week) {
    query = query.eq('week', filters.week)
  }
  
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// Player season stats
export async function getPlayerSeasonOffenseStats(filters?: {
  playerId?: string
  seasonId?: string
  teamId?: string
}) {
  const supabase = createClient()
  let query = supabase
    .from('v_player_season_offense')
    .select('*')
    .order('total_tds', { ascending: false })
  
  if (filters?.playerId) {
    query = query.eq('player_id', filters.playerId)
  }
  
  if (filters?.seasonId) {
    query = query.eq('season_id', filters.seasonId)
  }
  
  if (filters?.teamId) {
    query = query.eq('team_id', filters.teamId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getPlayerSeasonDefenseStats(filters?: {
  playerId?: string
  seasonId?: string
  teamId?: string
}) {
  const supabase = createClient()
  let query = supabase
    .from('v_player_season_defense')
    .select('*')
    .order('tackles', { ascending: false })
  
  if (filters?.playerId) {
    query = query.eq('player_id', filters.playerId)
  }
  
  if (filters?.seasonId) {
    query = query.eq('season_id', filters.seasonId)
  }
  
  if (filters?.teamId) {
    query = query.eq('team_id', filters.teamId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// Roster queries
export async function getTeamRoster(teamId: string, seasonId?: string) {
  const supabase = createClient()
  let query = supabase
    .from('rosters')
    .select(`
      *,
      players (
        id,
        first_name,
        last_name,
        primary_position,
        secondary_position,
        avatar_url
      ),
      teams (
        name,
        slug
      )
    `)
    .eq('team_id', teamId)
    .order('jersey_number', { ascending: true, nullsFirst: false })
  
  if (seasonId) {
    query = query.eq('season_id', seasonId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// Admin queries
export async function isUserAdmin(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single()
  
  if (error) return false
  return data.role === 'admin'
}

export async function getAuditLogs(filters?: {
  entity?: string
  entityId?: string
  limit?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('audit_log')
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .order('created_at', { ascending: false })
  
  if (filters?.entity) {
    query = query.eq('entity', filters.entity)
  }
  
  if (filters?.entityId) {
    query = query.eq('entity_id', filters.entityId)
  }
  
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// Utility queries
export async function getWeeks(seasonId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('games')
    .select('week')
    .eq('season_id', seasonId)
    .order('week')
  
  if (error) throw error
  
  // Return unique weeks
  const weeks = [...new Set(data.map(g => g.week))].sort((a, b) => a - b)
  return weeks
}