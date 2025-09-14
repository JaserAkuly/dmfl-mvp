import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn("card-dmfl bg-card border-lines text-center py-12", className)}>
      <Icon className="h-16 w-16 text-muted-text mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-muted-text mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          {...(action.href && { asChild: true })}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </Card>
  )
}