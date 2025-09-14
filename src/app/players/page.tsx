'use client'

import { Suspense, useState } from 'react'
import { SiteHeader } from '@/components/dmfl/site-header'
import { PlayerRow } from '@/components/dmfl/player-row'
import { LoadingSkeleton } from '@/components/dmfl/loading-skeleton'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Users, Filter } from 'lucide-react'

// Mock data for now
const MOCK_PLAYERS = [
  {
    id: '1',
    first_name: 'Ahmad',
    last_name: 'Johnson',
    primary_position: 'QB' as const,
    secondary_position: null,
    avatar_url: null,
    roster: {
      jersey_number: 12,
      role: 'captain',
      teams: {
        name: 'Thunder',
        slug: 'thunder',
        color_primary: '#0F4C81'
      }
    },
    stats: {
      'Pass Yds': 1247,
      'Pass TDs': 14,
      'Total TDs': 16
    }
  },
  {
    id: '2',
    first_name: 'Mohammed',
    last_name: 'Smith',
    primary_position: 'WR' as const,
    secondary_position: 'FLEX' as const,
    avatar_url: null,
    roster: {
      jersey_number: 84,
      role: 'player',
      teams: {
        name: 'Eagles',
        slug: 'eagles',
        color_primary: '#16A34A'
      }
    },
    stats: {
      'Rec Yds': 892,
      'Rec TDs': 12,
      'Receptions': 56
    }
  },
  {
    id: '3',
    first_name: 'Hassan',
    last_name: 'Williams',
    primary_position: 'RB' as const,
    secondary_position: null,
    avatar_url: null,
    roster: {
      jersey_number: 22,
      role: 'co_captain',
      teams: {
        name: 'Lions',
        slug: 'lions',
        color_primary: '#B45309'
      }
    },
    stats: {
      'Rush Yds': 743,
      'Rush TDs': 9,
      'Rush Att': 87
    }
  },
  {
    id: '4',
    first_name: 'Omar',
    last_name: 'Brown',
    primary_position: 'DB' as const,
    secondary_position: 'LB' as const,
    avatar_url: null,
    roster: {
      jersey_number: 21,
      role: 'player',
      teams: {
        name: 'Warriors',
        slug: 'warriors',
        color_primary: '#DC2626'
      }
    },
    stats: {
      'Tackles': 34,
      'Ints': 5,
      'Deflections': 12
    }
  },
  {
    id: '5',
    first_name: 'Yusuf',
    last_name: 'Davis',
    primary_position: 'RUSH' as const,
    secondary_position: null,
    avatar_url: null,
    roster: {
      jersey_number: 99,
      role: 'player',
      teams: {
        name: 'Wolves',
        slug: 'wolves',
        color_primary: '#6B7280'
      }
    },
    stats: {
      'Sacks': 7,
      'Tackles': 28,
      'FF': 3
    }
  }
]

const POSITIONS = ['All', 'QB', 'WR', 'RB', 'DB', 'LB', 'RUSH', 'FLEX']
const TEAMS = ['All Teams', 'Thunder', 'Eagles', 'Lions', 'Warriors', 'Wolves', 'Hawks']

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('All')
  const [selectedTeam, setSelectedTeam] = useState('All Teams')

  // Filter players based on search and filters
  const filteredPlayers = MOCK_PLAYERS.filter(player => {
    const matchesSearch = searchTerm === '' || 
      `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPosition = selectedPosition === 'All' || 
      player.primary_position === selectedPosition ||
      player.secondary_position === selectedPosition
    
    const matchesTeam = selectedTeam === 'All Teams' || 
      player.roster?.teams?.name === selectedTeam

    return matchesSearch && matchesPosition && matchesTeam
  })

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      
      <main className="container py-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-ink">Players</h1>
              <p className="text-muted-text">
                DMFL Season 4 player roster and statistics
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-text" />
              <Badge variant="outline">
                {MOCK_PLAYERS.length} Players
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-text" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-text" />
              <span className="text-sm font-medium text-muted-text">Filter by:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map(position => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  {TEAMS.map(team => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-text">
            Showing {filteredPlayers.length} of {MOCK_PLAYERS.length} players
          </div>
        </div>

        {/* Players List */}
        <section>
          <Suspense fallback={<LoadingSkeleton type="player-list" rows={10} />}>
            <div className="space-y-3">
              {filteredPlayers.map(player => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  roster={player.roster}
                  stats={player.stats}
                  showTeam={true}
                />
              ))}
              
              {filteredPlayers.length === 0 && (
                <div className="text-center py-12 text-muted-text">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No players found matching your criteria</p>
                </div>
              )}
            </div>
          </Suspense>
        </section>
      </main>
    </div>
  )
}