import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format player name
export function formatPlayerName(firstName: string, lastName: string, shortFormat = false) {
  if (shortFormat) {
    return `${firstName.charAt(0)}. ${lastName}`
  }
  return `${firstName} ${lastName}`
}

// Format team record
export function formatRecord(wins: number, losses: number, ties: number) {
  if (ties > 0) {
    return `${wins}-${losses}-${ties}`
  }
  return `${wins}-${losses}`
}

// Calculate completion percentage
export function calculateCompletionPercentage(completions: number, attempts: number): number {
  if (attempts === 0) return 0
  return Math.round((completions / attempts) * 100 * 10) / 10
}

// Calculate average
export function calculateAverage(total: number, attempts: number): number {
  if (attempts === 0) return 0
  return Math.round((total / attempts) * 10) / 10
}

// Format position display
export function formatPosition(primary?: string, secondary?: string): string {
  if (!primary) return ''
  if (secondary && secondary !== primary) {
    return `${primary}/${secondary}`
  }
  return primary
}

// Generate player initials for avatar
export function getPlayerInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Format game time
export function formatGameTime(kickoffAt: string): string {
  const date = new Date(kickoffAt)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Format date only
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format short date
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Generate team slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Validate hex color
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

// Format points (with + for positive)
export function formatPointDifference(diff: number): string {
  if (diff > 0) return `+${diff}`
  return diff.toString()
}

// Get ordinal suffix
export function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) return `${num}st`
  if (j === 2 && k !== 12) return `${num}nd`
  if (j === 3 && k !== 13) return `${num}rd`
  return `${num}th`
}

// Calculate passer rating (simplified version)
export function calculatePasserRating(
  attempts: number,
  completions: number,
  yards: number,
  touchdowns: number,
  interceptions: number
): number {
  if (attempts === 0) return 0
  
  // Simplified formula for flag football
  const compPct = (completions / attempts) * 100
  const yardsPerAtt = yards / attempts
  const tdPct = (touchdowns / attempts) * 100
  const intPct = (interceptions / attempts) * 100
  
  // Weighted scoring
  const rating = compPct * 0.4 + yardsPerAtt * 2 + tdPct * 6 - intPct * 4
  
  return Math.max(0, Math.round(rating * 10) / 10)
}

// Check if game is live or upcoming
export function getGameTimeStatus(kickoffAt: string, status: string): 'upcoming' | 'live' | 'final' {
  if (status === 'final') return 'final'
  if (status === 'live') return 'live'
  
  const now = new Date()
  const kickoff = new Date(kickoffAt)
  
  if (kickoff <= now) return 'live'
  return 'upcoming'
}

// Sort players by position priority
export const POSITION_PRIORITY = {
  'QB': 1,
  'RB': 2,
  'WR': 3,
  'FLEX': 4,
  'DB': 5,
  'LB': 6,
  'RUSH': 7,
} as const

export function sortByPosition(a: string | null, b: string | null): number {
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1
  
  const priorityA = POSITION_PRIORITY[a as keyof typeof POSITION_PRIORITY] || 999
  const priorityB = POSITION_PRIORITY[b as keyof typeof POSITION_PRIORITY] || 999
  
  return priorityA - priorityB
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Create player display object
export interface PlayerDisplay {
  id: string
  name: string
  shortName: string
  initials: string
  position: string
  jerseyNumber?: number
}

export function createPlayerDisplay(
  player: {
    id: string
    first_name: string
    last_name: string
    primary_position?: string | null
    secondary_position?: string | null
  },
  roster?: {
    jersey_number?: number | null
  }
): PlayerDisplay {
  return {
    id: player.id,
    name: formatPlayerName(player.first_name, player.last_name),
    shortName: formatPlayerName(player.first_name, player.last_name, true),
    initials: getPlayerInitials(player.first_name, player.last_name),
    position: formatPosition(player.primary_position || undefined, player.secondary_position || undefined),
    jerseyNumber: roster?.jersey_number || undefined,
  }
}