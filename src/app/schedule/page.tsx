'use client'

import { Suspense, useState, useEffect } from 'react'
import { SiteHeader } from '@/components/dmfl/site-header'
import { ScheduleTable } from '@/components/dmfl/schedule-table'
import { LoadingSkeleton } from '@/components/dmfl/loading-skeleton'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar, Filter } from 'lucide-react'

// Mock data for now - in production this would use the queries
const MOCK_GAMES = [
  {
    id: '1',
    week: 1,
    kickoff_at: '2024-09-15T14:00:00Z',
    location: 'Norbuck Park',
    status: 'final' as const,
    home_score: 21,
    away_score: 14,
    home_team: {
      id: '1',
      name: 'Thunder',
      slug: 'thunder',
      color_primary: '#0F4C81',
      logo_url: null
    },
    away_team: {
      id: '2',
      name: 'Lions',
      slug: 'lions',
      color_primary: '#B45309',
      logo_url: null
    }
  },
  {
    id: '2',
    week: 1,
    kickoff_at: '2024-09-15T15:30:00Z',
    location: 'Norbuck Park',
    status: 'final' as const,
    home_score: 28,
    away_score: 7,
    home_team: {
      id: '3',
      name: 'Eagles',
      slug: 'eagles',
      color_primary: '#16A34A',
      logo_url: null
    },
    away_team: {
      id: '4',
      name: 'Warriors',
      slug: 'warriors',
      color_primary: '#DC2626',
      logo_url: null
    }
  },
  {
    id: '3',
    week: 2,
    kickoff_at: '2024-09-22T14:00:00Z',
    location: 'Norbuck Park',
    status: 'scheduled' as const,
    home_score: 0,
    away_score: 0,
    home_team: {
      id: '2',
      name: 'Lions',
      slug: 'lions',
      color_primary: '#B45309',
      logo_url: null
    },
    away_team: {
      id: '3',
      name: 'Eagles',
      slug: 'eagles',
      color_primary: '#16A34A',
      logo_url: null
    }
  }
]

export default function SchedulePage() {
  const [selectedWeek, setSelectedWeek] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [games, setGames] = useState(MOCK_GAMES)

  // Filter games based on selections
  const filteredGames = games.filter(game => {
    const weekMatch = selectedWeek === 'all' || game.week === parseInt(selectedWeek)
    const statusMatch = selectedStatus === 'all' || game.status === selectedStatus
    return weekMatch && statusMatch
  })

  // Get unique weeks
  const weeks = [...new Set(games.map(g => g.week))].sort((a, b) => a - b)

  // Calculate stats
  const totalGames = games.length
  const completedGames = games.filter(g => g.status === 'final').length
  const upcomingGames = games.filter(g => g.status === 'scheduled').length

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      
      <main className="container py-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-ink">Schedule & Results</h1>
              <p className="text-muted-text">
                DMFL Season 4 game schedule and results
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="outline" className="text-accent-primary border-accent-primary">
                {totalGames} Total Games
              </Badge>
              <Badge variant="default">
                {completedGames} Completed
              </Badge>
              <Badge variant="secondary">
                {upcomingGames} Upcoming
              </Badge>
            </div>
          </div>

          {/* Mobile stats */}
          <div className="flex md:hidden justify-center space-x-2">
            <Badge variant="outline" className="text-accent-primary border-accent-primary">
              {totalGames} Total
            </Badge>
            <Badge variant="default">
              {completedGames} Done
            </Badge>
            <Badge variant="secondary">
              {upcomingGames} Left
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-text" />
            <span className="text-sm font-medium text-muted-text">Filter by:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weeks</SelectItem>
                {weeks.map(week => (
                  <SelectItem key={week} value={week.toString()}>
                    Week {week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="scheduled">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="final">Completed</SelectItem>
                <SelectItem value="postponed">Postponed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Schedule */}
        <section>
          <Suspense fallback={<LoadingSkeleton type="schedule" rows={8} />}>
            <ScheduleTable
              games={filteredGames}
              showWeekTabs={false}
              compactView={false}
            />
          </Suspense>
        </section>
      </main>
    </div>
  )
}