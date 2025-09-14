'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createPlayerDisplay, cn } from '@/lib/utils'
import { Trophy, TrendingUp } from 'lucide-react'

interface LeaderboardEntry {
  category: string
  type: 'offense' | 'defense'
  player_id: string
  first_name: string
  last_name: string
  primary_position: string | null
  team_id: string
  team_name: string
  season_id: string
  season_name: string
  week: number | null
  stat_value: number
  games_played: number
}

interface LeaderTableProps {
  leaders: LeaderboardEntry[]
  categories: Array<{
    key: string
    label: string
    type: 'offense' | 'defense'
  }>
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  showWeekFilter?: boolean
  selectedWeek?: string
  onWeekChange?: (week: string) => void
  weeks?: number[]
  title?: string
  maxRows?: number
  className?: string
}

export function LeaderTable({
  leaders,
  categories,
  selectedCategory = 'total_tds',
  onCategoryChange,
  showWeekFilter = false,
  selectedWeek = 'season',
  onWeekChange,
  weeks = [],
  title = 'Leaders',
  maxRows = 10,
  className
}: LeaderTableProps) {
  const [internalCategory, setInternalCategory] = useState(selectedCategory)
  const [internalWeek, setInternalWeek] = useState(selectedWeek)

  const currentCategory = onCategoryChange ? selectedCategory : internalCategory
  const currentWeek = onWeekChange ? selectedWeek : internalWeek

  const handleCategoryChange = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category)
    } else {
      setInternalCategory(category)
    }
  }

  const handleWeekChange = (week: string) => {
    if (onWeekChange) {
      onWeekChange(week)
    } else {
      setInternalWeek(week)
    }
  }

  // Filter leaders by current category and week
  const filteredLeaders = leaders
    .filter(leader => leader.category === currentCategory)
    .filter(leader => {
      if (currentWeek === 'season') return true
      return leader.week === parseInt(currentWeek)
    })
    .slice(0, maxRows)

  const currentCategoryInfo = categories.find(cat => cat.key === currentCategory)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Trophy className="h-4 w-4 text-gray-400" />
      case 3:
        return <Trophy className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-text">#{rank}</span>
    }
  }

  const formatStatValue = (value: number, category: string) => {
    if (category.includes('pct') || category.includes('avg')) {
      return value.toFixed(1)
    }
    return value.toString()
  }

  if (filteredLeaders.length === 0) {
    return (
      <Card className={cn("card-dmfl bg-card border-lines", className)}>
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-muted-text mx-auto mb-3" />
          <p className="text-muted-text">No statistics available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("card-dmfl bg-card border-lines", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <div className="flex items-center space-x-2">
            {showWeekFilter && (
              <Select value={currentWeek} onValueChange={handleWeekChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="season">Season</SelectItem>
                  {weeks.map(week => (
                    <SelectItem key={week} value={week.toString()}>
                      Week {week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={currentCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Badge */}
        {currentCategoryInfo && (
          <div className="flex items-center space-x-2">
            <Badge 
              variant={currentCategoryInfo.type === 'offense' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {currentCategoryInfo.type.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-text">
              {currentCategoryInfo.label} • 
              {currentWeek === 'season' ? 'Season Total' : `Week ${currentWeek}`}
            </span>
          </div>
        )}

        {/* Leaders List */}
        <div className="space-y-2">
          {filteredLeaders.map((leader, index) => {
            const displayPlayer = createPlayerDisplay(leader)
            
            return (
              <Link key={`${leader.player_id}-${leader.category}`} href={`/players/${leader.player_id}`}>
                <div className="flex items-center justify-between p-3 rounded-lg border border-lines transition-micro hover:bg-secondary/50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    {/* Rank */}
                    <div className="w-8 flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    {/* Player Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-ink">{displayPlayer.name}</span>
                        {displayPlayer.position && (
                          <Badge variant="outline" className="text-xs">
                            {displayPlayer.position}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-text">{leader.team_name}</div>
                    </div>
                  </div>
                  
                  {/* Stat Value */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-accent-primary">
                      {formatStatValue(leader.stat_value, leader.category)}
                    </div>
                    <div className="text-xs text-muted-text">
                      {leader.games_played} games
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Link */}
        {filteredLeaders.length === maxRows && (
          <div className="pt-2 border-t border-lines">
            <Link href="/leaderboards">
              <Button variant="ghost" size="sm" className="w-full">
                View All Leaders
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  )
}