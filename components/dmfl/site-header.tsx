'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Menu, X, Calendar, Users, Trophy, BarChart3, Settings } from 'lucide-react'

interface SiteHeaderProps {
  seasons?: Array<{
    id: string
    name: string
    active: boolean
  }>
  activeSeason?: string
  weeks?: number[]
  selectedWeek?: string
  onSeasonChange?: (seasonId: string) => void
  onWeekChange?: (week: string) => void
  showWeekSelector?: boolean
}

export function SiteHeader({
  seasons = [],
  activeSeason,
  weeks = [],
  selectedWeek,
  onSeasonChange,
  onWeekChange,
  showWeekSelector = false
}: SiteHeaderProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Overview', href: '/', icon: BarChart3 },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Players', href: '/players', icon: Users },
    { name: 'Leaderboards', href: '/leaderboards', icon: Trophy },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-lines bg-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/95">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/brand/dmfl-logo.png"
                alt="DMFL Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-ink">DMFL</h1>
                <p className="text-xs text-muted-text">Season 4</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-accent-primary",
                    isActive(item.href) 
                      ? "text-accent-primary" 
                      : "text-muted-text"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Season/Week Selectors & Admin */}
          <div className="hidden md:flex items-center space-x-3">
            {seasons.length > 0 && onSeasonChange && (
              <Select value={activeSeason} onValueChange={onSeasonChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {showWeekSelector && weeks.length > 0 && onWeekChange && (
              <Select value={selectedWeek} onValueChange={onWeekChange}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {weeks.map((week) => (
                    <SelectItem key={week} value={week.toString()}>
                      Week {week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-lines bg-canvas">
            <div className="space-y-1 pb-4 pt-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-lg transition-colors",
                      isActive(item.href)
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "text-muted-text hover:bg-secondary/50 hover:text-ink"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Admin Link */}
              <Link
                href="/admin"
                className="flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-lg text-muted-text hover:bg-secondary/50 hover:text-ink transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Admin</span>
              </Link>

              {/* Mobile Selectors */}
              {(seasons.length > 0 || (showWeekSelector && weeks.length > 0)) && (
                <div className="px-3 pt-2 space-y-3 border-t border-lines mt-3">
                  {seasons.length > 0 && onSeasonChange && (
                    <div>
                      <label className="text-xs font-medium text-muted-text mb-1 block">
                        Season
                      </label>
                      <Select value={activeSeason} onValueChange={onSeasonChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons.map((season) => (
                            <SelectItem key={season.id} value={season.id}>
                              {season.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {showWeekSelector && weeks.length > 0 && onWeekChange && (
                    <div>
                      <label className="text-xs font-medium text-muted-text mb-1 block">
                        Week
                      </label>
                      <Select value={selectedWeek} onValueChange={onWeekChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select week" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Weeks</SelectItem>
                          {weeks.map((week) => (
                            <SelectItem key={week} value={week.toString()}>
                              Week {week}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}