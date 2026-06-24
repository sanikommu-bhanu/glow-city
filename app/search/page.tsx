'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import SalonCard from '@/components/SalonCard'
import { PageHeader } from '@/components/AppShell'
import { CATEGORIES } from '@/lib/types'
import { mappedSalons } from '@/app/home/page'
import { cn } from '@/lib/cn'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [openNow, setOpenNow] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [salons, setSalons] = useState(mappedSalons)

  useEffect(() => {
    let filtered = mappedSalons

    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.area.toLowerCase().includes(q) || 
        s.category.some((c: string) => c.toLowerCase().includes(q))
      )
    }

    if (category !== 'All') {
      filtered = filtered.filter(s => s.category.includes(category))
    }

    if (minRating > 0) {
      filtered = filtered.filter(s => s.rating >= minRating)
    }

    setSalons(filtered)
  }, [query, category, openNow, minRating])

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
            className="w-full rounded-[14px] border border-border bg-white pl-12 pr-4 py-3.5 font-dm text-sm shadow-card outline-none focus:border-rose-gold"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scroll mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setCategory(c.name)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full border text-sm font-dm font-medium transition-all',
                category === c.name ? 'pill-active border-transparent' : 'bg-white border-border hover:border-rose-gold/40'
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
            className={cn('px-3 py-1.5 rounded-full border text-xs font-dm transition-all', openNow ? 'pill-active border-transparent' : 'border-border bg-white hover:border-rose-gold/40')}
          >
            Open now
          </button>
          {[4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={cn('px-3 py-1.5 rounded-full border text-xs font-dm transition-all', minRating === r ? 'pill-active border-transparent' : 'border-border bg-white hover:border-rose-gold/40')}
            >
              {r}+ stars
            </button>
          ))}
        </div>

        {salons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[20px] border border-border">
            <MapPin className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="font-cormorant text-xl text-luxury-black mb-2">No salons found</p>
            <p className="font-dm text-sm text-text-muted mb-4">Try adjusting filters or search a different area</p>
            <button onClick={() => {setQuery(''); setCategory('All'); setMinRating(0); setOpenNow(false)}} className="font-dm text-sm text-rose-gold font-semibold">Clear filters</button>
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
