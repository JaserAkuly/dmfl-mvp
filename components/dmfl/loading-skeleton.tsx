import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  type: 'stat-cards' | 'table' | 'team-grid' | 'player-list' | 'schedule'
  rows?: number
  className?: string
}

export function LoadingSkeleton({ 
  type, 
  rows = 5, 
  className 
}: LoadingSkeletonProps) {
  switch (type) {
    case 'stat-cards':
      return (
        <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="card-dmfl bg-card border-lines">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      )

    case 'table':
      return (
        <Card className={cn("card-dmfl bg-card border-lines", className)}>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-40" />
            </div>
            
            {/* Table rows */}
            <div className="space-y-3">
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-lines">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )

    case 'team-grid':
      return (
        <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="card-dmfl bg-card border-lines">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <div className="space-y-0.5">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )

    case 'player-list':
      return (
        <div className={cn("space-y-4", className)}>
          {Array.from({ length: rows }).map((_, i) => (
            <Card key={i} className="card-dmfl bg-card border-lines">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-8 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="text-center">
                      <Skeleton className="h-4 w-8 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )

    case 'schedule':
      return (
        <div className={cn("space-y-4", className)}>
          {Array.from({ length: rows }).map((_, i) => (
            <Card key={i} className="card-dmfl bg-card border-lines">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center min-w-[80px] space-y-1">
                    <Skeleton className="h-3 w-12 mx-auto" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-8" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-8" />
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )

    default:
      return (
        <div className={cn("space-y-4", className)}>
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )
  }
}