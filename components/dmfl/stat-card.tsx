import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className
}: StatCardProps) {
  return (
    <Card className={cn("card-dmfl bg-card border-lines", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-text">{title}</p>
          <div>
            <p className="text-2xl font-semibold text-ink">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-text">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className="flex items-center space-x-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}
              </span>
              <span className="text-sm text-muted-text">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10">
          <Icon className="h-5 w-5 text-accent-primary" />
        </div>
      </div>
    </Card>
  )
}