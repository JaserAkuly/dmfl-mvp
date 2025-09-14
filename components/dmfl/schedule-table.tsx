'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatGameTime, formatShortDate, cn } from '@/lib/utils'
import { Calendar, MapPin } from 'lucide-react'

type GameStatus = 'scheduled' | 'live' | 'final' | 'postponed'

interface Game {
  id: string
  week: number
  kickoff_at: string
  location?: string | null
  status: GameStatus
  home_score: number | null
  away_score: number | null
  home_team: {
    id: string
    name: string
    slug: string
    color_primary: string
    logo_url?: string | null
  }
  away_team: {
    id: string
    name: string
    slug: string
    color_primary: string
    logo_url?: string | null
  }
}

interface ScheduleTableProps {
  games: Game[]
  showWeekTabs?: boolean
  compactView?: boolean
  className?: string
}

export function ScheduleTable({ 
  games, 
  showWeekTabs = true, 
  compactView = false,
  className 
}: ScheduleTableProps) {
  const weeks = [...new Set(games.map(g => g.week))].sort((a, b) => a - b)
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]?.toString() || '1')
  
  const filteredGames = showWeekTabs 
    ? games.filter(g => g.week === parseInt(selectedWeek))
    : games

  const getStatusBadge = (status: GameStatus) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
      case 'final':
        return <Badge variant="secondary">FINAL</Badge>
      case 'postponed':
        return <Badge variant="destructive">POSTPONED</Badge>
      default:
        return null
    }
  }

  const GameCard = ({ game }: { game: Game }) => (
    <Card className="card-dmfl bg-card border-lines transition-micro hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Date/Time */}
          <div className="text-center min-w-[80px]">
            <div className="text-xs text-muted-text">
              {formatShortDate(game.kickoff_at)}
            </div>
            <div className="text-sm font-medium text-ink">
              {new Date(game.kickoff_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>
          
          {/* Teams */}
          <div className="flex-1 space-y-2">
            {/* Away Team */}
            <div className="flex items-center justify-between">
              <Link 
                href={`/teams/${game.away_team.slug}`}
                className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
              >
                {game.away_team.logo_url ? (
                  <img
                    src={game.away_team.logo_url}
                    alt={`${game.away_team.name} logo`}
                    className="h-6 w-6 rounded"
                  />
                ) : (
                  <div
                    className="h-6 w-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: game.away_team.color_primary }}
                  >
                    {game.away_team.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-ink">{game.away_team.name}</span>
              </Link>
              {game.status === 'final' && (
                <span className="text-lg font-bold text-ink min-w-[30px] text-right">
                  {game.away_score}
                </span>
              )}
            </div>
            
            {/* Home Team */}
            <div className="flex items-center justify-between">
              <Link 
                href={`/teams/${game.home_team.slug}`}
                className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
              >
                {game.home_team.logo_url ? (
                  <img
                    src={game.home_team.logo_url}
                    alt={`${game.home_team.name} logo`}
                    className="h-6 w-6 rounded"
                  />
                ) : (
                  <div
                    className="h-6 w-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: game.home_team.color_primary }}
                  >
                    {game.home_team.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-ink">{game.home_team.name}</span>
              </Link>
              {game.status === 'final' && (
                <span className="text-lg font-bold text-ink min-w-[30px] text-right">
                  {game.home_score}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right space-y-2">
          {getStatusBadge(game.status)}
          {game.location && (
            <div className="flex items-center text-xs text-muted-text">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[120px]">{game.location}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  const CompactGameRow = ({ game }: { game: Game }) => (
    <div className="flex items-center justify-between py-3 border-b border-lines last:border-0">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-text min-w-[60px]">
          {formatShortDate(game.kickoff_at)}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {game.away_team.name} @ {game.home_team.name}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {game.status === 'final' ? (
          <span className="text-sm font-bold">
            {game.away_score}-{game.home_score}
          </span>
        ) : (
          <span className="text-sm text-muted-text">
            {formatGameTime(game.kickoff_at).split(',')[1]?.trim()}
          </span>
        )}
        {getStatusBadge(game.status)}
      </div>
    </div>
  )

  if (games.length === 0) {
    return (
      <Card className={cn("card-dmfl bg-card border-lines text-center py-8", className)}>
        <Calendar className="h-12 w-12 text-muted-text mx-auto mb-3" />
        <p className="text-muted-text">No games scheduled</p>
      </Card>
    )
  }

  return (
    <div className={className}>
      {showWeekTabs ? (
        <Tabs value={selectedWeek} onValueChange={setSelectedWeek}>
          <TabsList className="mb-6">
            {weeks.map((week) => (
              <TabsTrigger key={week} value={week.toString()}>
                Week {week}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {weeks.map((week) => (
            <TabsContent key={week} value={week.toString()}>
              <div className="space-y-4">
                {filteredGames.map((game) =>
                  compactView ? (
                    <Card key={game.id} className="card-dmfl bg-card border-lines">
                      <CompactGameRow game={game} />
                    </Card>
                  ) : (
                    <GameCard key={game.id} game={game} />
                  )
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="space-y-4">
          {filteredGames.map((game) =>
            compactView ? (
              <Card key={game.id} className="card-dmfl bg-card border-lines">
                <CompactGameRow game={game} />
              </Card>
            ) : (
              <GameCard key={game.id} game={game} />
            )
          )}
        </div>
      )}
    </div>
  )
}