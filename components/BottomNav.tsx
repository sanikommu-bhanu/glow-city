'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Compass, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Explore' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/ai', icon: Sparkles, label: 'Glow AI' },
  { href: '/profile', icon: User, label: 'Me' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border flex items-center z-50 bottom-nav"
        style={{ height: 72 }}
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl mx-0.5 transition-colors',
                active && 'bg-rose-gold/8'
              )}
            >
              <Icon
                className={cn('w-5 h-5', active ? 'text-rose-gold' : 'text-text-muted')}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={cn(
                  'text-[10px] font-medium tracking-wide',
                  active ? 'text-rose-gold' : 'text-text-muted'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-[72px] lg:w-[220px] flex-col glass border-r border-border z-50 pt-6"
        aria-label="Main navigation"
      >
        <Link href="/home" className="px-4 lg:px-6 mb-8">
          <span className="font-cormorant font-semibold text-xl lg:text-2xl text-luxury-black">
            Glow<span className="text-rose-gold">City</span>
            <span className="font-dm font-bold text-xs text-champagne ml-0.5">AI</span>
          </span>
        </Link>
        <div className="flex flex-col gap-1 px-3 lg:px-4 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all',
                  active
                    ? 'bg-gradient-gold text-white shadow-gold'
                    : 'text-text-secondary hover:bg-rose-gold/8 hover:text-rose-gold'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                <span className="hidden lg:block font-dm text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
