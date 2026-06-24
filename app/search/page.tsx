'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import SalonCard from '@/components/SalonCard'
import { PageHeader } from '@/components/AppShell'
import { SalonCardSkeleton } from '@/components/ui/Skeleton'
import { getSalons, type SalonFilters } from '@/lib/actions/salons'
import { CATEGORIES } from '@/lib/types'
import type { Salon } from '@/lib/types'
import { cn } from '@/lib/cn'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [openNow, setOpenNow] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setGeo({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setGeo({ lat: 19.076, lng: 72.877 })
    )
  }, [])

  useEffect(() => {
    const filters: SalonFilters = {
      city: 'Mumbai',
      search: query || undefined,
      category: category !== 'All' ? category : undefined,
      openNow,
      minRating: minRating || undefined,
      lat: geo?.lat,
      lng: geo?.lng,
    }
    setLoading(true)
    getSalons(filters)
      .then(setSalons)
      .catch(() => setSalons([]))
      .finally(() => setLoading(false))
  }, [query, category, openNow, minRating, geo])

  return (
    <div className="min-h-screen hero-gradient pb-8">
      <PageHeader city="Mumbai" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search salons, areas, services..."
            className="w-full rounded-[14px] border border-border bg-white pl-12 pr-4 py-3.5 font-dm text-sm shadow-card"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scroll mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setCategory(c.name)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full border text-sm font-dm font-medium',
                category === c.name ? 'pill-active' : 'bg-white border-border'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            type="button"
            onClick={() => setOpenNow(!openNow)}
            className={cn('px-3 py-1.5 rounded-full border text-xs font-dm', openNow ? 'pill-active' : 'border-border bg-white')}
          >
            Open now
          </button>
          {[4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={cn('px-3 py-1.5 rounded-full border text-xs font-dm', minRating === r ? 'pill-active' : 'border-border bg-white')}
            >
              {r}+ stars
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SalonCardSkeleton key={i} />
            ))}
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[20px] border border-border">
            <MapPin className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="font-cormorant text-xl text-luxury-black mb-2">No salons found</p>
            <p className="font-dm text-sm text-text-muted mb-4">Try adjusting filters or search a different area</p>
            <Link href="/home" className="font-dm text-sm text-rose-gold font-semibold">Back to home</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salons.map((s) => (
              <SalonCard key={s.id} salon={s} wide />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
