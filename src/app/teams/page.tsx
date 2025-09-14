import { Suspense } from 'react'
import { SiteHeader } from '@/components/dmfl/site-header'
import { TeamCard } from '@/components/dmfl/team-card'
import { LoadingSkeleton } from '@/components/dmfl/loading-skeleton'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

// Mock data for now
const MOCK_TEAMS = [
  {
    id: '1',
    name: 'Thunder',
    slug: 'thunder',
    color_primary: '#0F4C81',
    logo_url: null,
    standings: {
      wins: 3,
      losses: 1,
      ties: 0,
      points_for: 84,
      points_against: 56,
      point_diff: 28,
      win_pct: 75.0,
      games_played: 4
    }
  },
  {
    id: '2',
    name: 'Lions',
    slug: 'lions',
    color_primary: '#B45309',
    logo_url: null,
    standings: {
      wins: 2,
      losses: 2,
      ties: 0,
      points_for: 70,
      points_against: 63,
      point_diff: 7,
      win_pct: 50.0,
      games_played: 4
    }
  },
  {
    id: '3',
    name: 'Eagles',
    slug: 'eagles',
    color_primary: '#16A34A',
    logo_url: null,
    standings: {
      wins: 4,
      losses: 0,
      ties: 0,
      points_for: 112,
      points_against: 42,
      point_diff: 70,
      win_pct: 100.0,
      games_played: 4
    }
  },
  {
    id: '4',
    name: 'Warriors',
    slug: 'warriors',
    color_primary: '#DC2626',
    logo_url: null,
    standings: {
      wins: 1,
      losses: 3,
      ties: 0,
      points_for: 49,
      points_against: 91,
      point_diff: -42,
      win_pct: 25.0,
      games_played: 4
    }
  },
  {
    id: '5',
    name: 'Wolves',
    slug: 'wolves',
    color_primary: '#6B7280',
    logo_url: null,
    standings: {
      wins: 2,
      losses: 1,
      ties: 1,
      points_for: 63,
      points_against: 56,
      point_diff: 7,
      win_pct: 62.5,
      games_played: 4
    }
  },
  {
    id: '6',
    name: 'Hawks',
    slug: 'hawks',
    color_primary: '#7C3AED',
    logo_url: null,
    standings: {
      wins: 0,
      losses: 4,
      ties: 0,
      points_for: 28,
      points_against: 98,
      point_diff: -70,
      win_pct: 0.0,
      games_played: 4
    }
  }
]

async function TeamsGrid() {
  // Sort teams by win percentage, then by point differential
  const sortedTeams = MOCK_TEAMS.sort((a, b) => {
    if (b.standings.win_pct !== a.standings.win_pct) {
      return b.standings.win_pct - a.standings.win_pct
    }
    return b.standings.point_diff - a.standings.point_diff
  })

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedTeams.map((team, index) => (
        <div key={team.id} className="relative">
          {index === 0 && (
            <Badge className="absolute -top-2 left-4 z-10 bg-yellow-500 text-yellow-50">
              #1
            </Badge>
          )}
          <TeamCard team={team} standings={team.standings} />
        </div>
      ))}
    </div>
  )
}

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      
      <main className="container py-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-ink">Teams</h1>
              <p className="text-muted-text">
                DMFL Season 4 team standings and information
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-text" />
              <Badge variant="outline">
                {MOCK_TEAMS.length} Teams
              </Badge>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <section>
          <Suspense fallback={<LoadingSkeleton type="team-grid" />}>
            <TeamsGrid />
          </Suspense>
        </section>

        {/* Standings Note */}
        <div className="text-center text-sm text-muted-text">
          <p>Teams ranked by win percentage, then by point differential</p>
        </div>
      </main>
    </div>
  )
}