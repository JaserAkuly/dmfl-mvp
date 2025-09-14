import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRecord, formatPointDifference } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TeamCardProps {
  team: {
    id: string
    name: string
    slug: string
    color_primary: string
    logo_url?: string | null
  }
  standings?: {
    wins: number
    losses: number
    ties: number
    points_for: number
    points_against: number
    point_diff: number
    win_pct: number
    games_played: number
  }
  className?: string
}

export function TeamCard({ team, standings, className }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.slug}`}>
      <Card className={cn(
        "card-dmfl bg-card border-lines transition-micro hover:shadow-md hover:scale-[1.02] cursor-pointer",
        className
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {team.logo_url ? (
              <img
                src={team.logo_url}
                alt={`${team.name} logo`}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: team.color_primary }}
              >
                {team.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-ink">{team.name}</h3>
              {standings && (
                <p className="text-sm text-muted-text">
                  {formatRecord(standings.wins, standings.losses, standings.ties)} • 
                  {standings.win_pct}% • 
                  {standings.games_played} games
                </p>
              )}
            </div>
          </div>
          
          {standings && (
            <div className="text-right space-y-1">
              <Badge 
                variant={standings.win_pct >= 50 ? "default" : "secondary"}
                className="text-xs"
              >
                {standings.win_pct}%
              </Badge>
              <div className="space-y-0.5">
                <div className="text-xs text-muted-text">
                  PF: {standings.points_for}
                </div>
                <div className="text-xs text-muted-text">
                  PA: {standings.points_against}
                </div>
                <div className={cn(
                  "text-xs font-medium",
                  standings.point_diff >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {formatPointDifference(standings.point_diff)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}