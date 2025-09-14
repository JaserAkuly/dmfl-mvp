import { Suspense } from 'react'
import { SiteHeader } from '@/components/dmfl/site-header'
import { StatCard } from '@/components/dmfl/stat-card'
import { LeaderTable } from '@/components/dmfl/leader-table'
import { ScheduleTable } from '@/components/dmfl/schedule-table'
import { LoadingSkeleton } from '@/components/dmfl/loading-skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  getActiveSeason, 
  getTeamStandings, 
  getLeaderboards, 
  getGames 
} from '@/lib/queries'
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  ChevronRight 
} from 'lucide-react'
import Link from 'next/link'

// Leader categories for the overview
const LEADER_CATEGORIES = [
  { key: 'pass_yds', label: 'Passing Yards', type: 'offense' as const },
  { key: 'rush_yds', label: 'Rushing Yards', type: 'offense' as const },
  { key: 'rec_yds', label: 'Receiving Yards', type: 'offense' as const },
  { key: 'total_tds', label: 'Total TDs', type: 'offense' as const },
  { key: 'interceptions', label: 'Interceptions', type: 'defense' as const },
  { key: 'sacks', label: 'Sacks', type: 'defense' as const },
]

async function OverviewStats() {
  try {
    const season = await getActiveSeason()
    const standings = await getTeamStandings(season.id)
    const games = await getGames({ seasonId: season.id, status: 'final' })
    
    // Calculate stats
    const totalTeams = standings?.length || 0
    const totalPlayers = standings?.reduce((sum, team) => sum + (team.games_played || 0), 0) || 0
    const avgPointsPerGame = games.length > 0 
      ? Math.round((games.reduce((sum, game) => sum + (game.home_score || 0) + (game.away_score || 0), 0) / games.length) * 10) / 10
      : 0
    const gamesPlayed = games.length

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Teams"
          value={totalTeams}
          icon={Users}
        />
        <StatCard
          title="Games Played"
          value={gamesPlayed}
          icon={Calendar}
        />
        <StatCard
          title="Avg Points/Game"
          value={avgPointsPerGame}
          icon={Target}
        />
        <StatCard
          title="Active Season"
          value={season.name}
          subtitle={`Week ${Math.max(...games.map(g => g.week), 0) || 1}`}
          icon={Trophy}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading overview stats:', error)
    return <LoadingSkeleton type="stat-cards" />
  }
}

async function TopPerformers() {
  try {
    const season = await getActiveSeason()
    const leaders = await getLeaderboards({ 
      seasonId: season.id, 
      limit: 5 
    })

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <LeaderTable
          leaders={leaders}
          categories={LEADER_CATEGORIES.filter(cat => cat.type === 'offense')}
          selectedCategory="total_tds"
          title="Top Offense"
          maxRows={5}
        />
        <LeaderTable
          leaders={leaders}
          categories={LEADER_CATEGORIES.filter(cat => cat.type === 'defense')}
          selectedCategory="interceptions"
          title="Top Defense"
          maxRows={5}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading top performers:', error)
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <LoadingSkeleton type="table" rows={5} />
        <LoadingSkeleton type="table" rows={5} />
      </div>
    )
  }
}

async function UpcomingGames() {
  try {
    const season = await getActiveSeason()
    const upcomingGames = await getGames({ 
      seasonId: season.id, 
      status: 'scheduled'
    })
    
    // Show next 4 upcoming games
    const nextGames = upcomingGames.slice(0, 4)

    if (nextGames.length === 0) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink">Upcoming Games</h2>
          </div>
          <div className="text-center py-8 text-muted-text">
            <Calendar className="h-12 w-12 mx-auto mb-3" />
            <p>No upcoming games scheduled</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Upcoming Games</h2>
          <Link href="/schedule">
            <Button variant="ghost" size="sm">
              View Schedule
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <ScheduleTable
          games={nextGames}
          showWeekTabs={false}
          compactView={true}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading upcoming games:', error)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Upcoming Games</h2>
          <Link href="/schedule">
            <Button variant="ghost" size="sm">
              View Schedule
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <LoadingSkeleton type="schedule" rows={4} />
      </div>
    )
  }
}

async function RecentResults() {
  try {
    const season = await getActiveSeason()
    const recentGames = await getGames({ 
      seasonId: season.id, 
      status: 'final'
    })
    
    // Show last 4 completed games
    const lastGames = recentGames
      .sort((a, b) => new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime())
      .slice(0, 4)

    if (lastGames.length === 0) {
      return null
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">Recent Results</h2>
          <Link href="/schedule">
            <Button variant="ghost" size="sm">
              View All Results
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <ScheduleTable
          games={lastGames}
          showWeekTabs={false}
          compactView={true}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading recent results:', error)
    return null
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      
      <main className="container py-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <Badge className="mb-4">Season 4 • 2024</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Dallas Muslim Flag Football League
          </h1>
          <p className="text-lg text-muted-text max-w-2xl mx-auto">
            Official stats hub featuring live scores, standings, player statistics, 
            and league information for DMFL Season 4.
          </p>
        </div>

        {/* Overview Stats */}
        <section>
          <Suspense fallback={<LoadingSkeleton type="stat-cards" />}>
            <OverviewStats />
          </Suspense>
        </section>

        {/* Top Performers */}
        <section>
          <Suspense fallback={
            <div className="grid gap-6 lg:grid-cols-2">
              <LoadingSkeleton type="table" rows={5} />
              <LoadingSkeleton type="table" rows={5} />
            </div>
          }>
            <TopPerformers />
          </Suspense>
        </section>

        {/* Games Section */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Upcoming Games */}
          <section>
            <Suspense fallback={
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-ink">Upcoming Games</h2>
                <LoadingSkeleton type="schedule" rows={4} />
              </div>
            }>
              <UpcomingGames />
            </Suspense>
          </section>

          {/* Recent Results */}
          <section>
            <Suspense fallback={
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-ink">Recent Results</h2>
                <LoadingSkeleton type="schedule" rows={4} />
              </div>
            }>
              <RecentResults />
            </Suspense>
          </section>
        </div>

        {/* Quick Links */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-ink">Explore DMFL</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/teams">
              <Button variant="outline" className="w-full h-16 flex-col space-y-1">
                <Users className="h-5 w-5" />
                <span>Teams</span>
              </Button>
            </Link>
            <Link href="/players">
              <Button variant="outline" className="w-full h-16 flex-col space-y-1">
                <Trophy className="h-5 w-5" />
                <span>Players</span>
              </Button>
            </Link>
            <Link href="/leaderboards">
              <Button variant="outline" className="w-full h-16 flex-col space-y-1">
                <TrendingUp className="h-5 w-5" />
                <span>Leaderboards</span>
              </Button>
            </Link>
            <Link href="/schedule">
              <Button variant="outline" className="w-full h-16 flex-col space-y-1">
                <Calendar className="h-5 w-5" />
                <span>Schedule</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}