import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { createPlayerDisplay, cn } from '@/lib/utils'

interface PlayerRowProps {
  player: {
    id: string
    first_name: string
    last_name: string
    primary_position?: string | null
    secondary_position?: string | null
    avatar_url?: string | null
  }
  roster?: {
    jersey_number?: number | null
    role?: string
    teams?: {
      name: string
      slug: string
      color_primary: string
    }
  }
  stats?: {
    [key: string]: number | string
  }
  showTeam?: boolean
  className?: string
}

export function PlayerRow({ 
  player, 
  roster, 
  stats, 
  showTeam = false,
  className 
}: PlayerRowProps) {
  const displayPlayer = createPlayerDisplay(player, roster)
  
  return (
    <Link href={`/players/${player.id}`}>
      <div className={cn(
        "flex items-center justify-between p-4 rounded-lg border border-lines bg-card transition-micro hover:bg-secondary/50 cursor-pointer",
        className
      )}>
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          {player.avatar_url ? (
            <img
              src={player.avatar_url}
              alt={displayPlayer.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-accent-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-accent-primary">
                {displayPlayer.initials}
              </span>
            </div>
          )}
          
          {/* Player Info */}
          <div>
            <div className="flex items-center space-x-2">
              {roster?.jersey_number && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  #{roster.jersey_number}
                </Badge>
              )}
              <h4 className="font-medium text-ink">{displayPlayer.name}</h4>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-text">
              {displayPlayer.position && (
                <span>{displayPlayer.position}</span>
              )}
              {showTeam && roster?.teams && (
                <>
                  <span>•</span>
                  <span style={{ color: roster.teams.color_primary }}>
                    {roster.teams.name}
                  </span>
                </>
              )}
              {roster?.role && roster.role !== 'player' && (
                <>
                  <span>•</span>
                  <Badge variant="secondary" className="text-xs">
                    {roster.role === 'co_captain' ? 'Co-Captain' : 'Captain'}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        {stats && (
          <div className="flex items-center space-x-6 text-sm">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="font-medium text-ink">{value}</div>
                <div className="text-xs text-muted-text capitalize">
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}