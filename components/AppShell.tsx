'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, MapPin, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import BottomNav from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
  showNav?: boolean
  className?: string
}

export function AppShell({ children, showNav = true, className }: AppShellProps) {
  const pathname = usePathname()
  const hideNavPaths = ['/', '/onboarding', '/auth']
  const shouldHideNav = hideNavPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  return (
    <div className="min-h-screen bg-warm-white">
      <div
        className={cn(
          'mx-auto w-full min-h-screen',
          showNav && !shouldHideNav && 'md:pl-[72px] lg:pl-[220px] pb-[72px] md:pb-0',
          className
        )}
      >
        {children}
      </div>
      {showNav && !shouldHideNav && <BottomNav />}
    </div>
  )
}

interface PageHeaderProps {
  city?: string | null
  area?: string | null
  notifCount?: number
  avatarInitial?: string
  onLocationClick?: () => void
}

export function PageHeader({
  city = 'Mumbai',
  area,
  notifCount = 0,
  avatarInitial = 'G',
  onLocationClick,
}: PageHeaderProps) {
  return (
    <header className="glass border-b border-border/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="md:hidden font-cormorant font-semibold text-[22px] text-luxury-black">
            Glow<span className="text-rose-gold">City</span>
            <span className="font-dm font-bold text-xs text-champagne ml-0.5">AI</span>
          </div>
          <button
            type="button"
            onClick={onLocationClick}
            className="hidden md:flex items-center gap-2 text-text-secondary hover:text-rose-gold transition-colors"
          >
            <MapPin className="w-4 h-4 text-rose-gold" />
            <span className="font-dm text-sm font-medium">
              {area ? `${area}, ` : ''}{city}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/notifications"
              className="relative p-2 rounded-xl hover:bg-rose-gold/8 transition-colors focus-visible:ring-2 focus-visible:ring-rose-gold"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-gold flex items-center justify-center text-white text-[10px] font-bold">
                  {notifCount}
                </span>
              )}
            </Link>
            <Link href="/profile">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-gold shadow-gold">
                {avatarInitial}
              </div>
            </Link>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-1.5 mb-3">
          <MapPin className="w-4 h-4 text-rose-gold" />
          <span className="font-dm text-[13px] font-medium text-text-secondary">
            {area ? `${area}, ` : ''}{city}
          </span>
        </div>
      </div>
    </header>
  )
}
