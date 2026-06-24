'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, Sparkles, TrendingUp, MapPin, ChevronRight, Scissors, Palette, Flower2, Gem, Leaf, Crown } from 'lucide-react'
import SalonCard, { RecommendedSalonCard } from '@/components/SalonCard'
import { PageHeader } from '@/components/AppShell'
import { CATEGORIES } from '@/lib/types'
import { SALONS, SERVICES, mappedSalons } from '@/lib/data'
import { slugify } from '@/lib/utils'
import { formatPrice } from '@/lib/types'
import { cn } from '@/lib/cn'

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Scissors, Palette, Flower2, Gem, Leaf, Crown,
}



export default function HomePage() {
  const [activeTag, setActiveTag] = useState('All')

  const filteredSalons =
    activeTag === 'All'
      ? mappedSalons
      : mappedSalons.filter((s) => s.category.includes(activeTag) || activeTag === 'All')

  // Mock recommendations
  const recommendations = [
    { salon: mappedSalons[0], matchPercent: 98, reason: 'Matches your hair type & favorite stylist', source: 'activity' as const },
    { salon: mappedSalons[1], matchPercent: 95, reason: 'Highly rated for Spa near you', source: 'trending' as const },
  ]

  // Mock trending services from local SERVICES
  const trendingServices = SERVICES.filter(s => s.popular).map(s => ({
    ...s,
    image_url: mappedSalons.find(ms => ms.category.includes(s.category))?.cover_image_url || mappedSalons[0].cover_image_url,
    salon: mappedSalons[Math.floor(Math.random() * mappedSalons.length)]
  }))

  return (
    <div className="hero-gradient min-h-screen pb-8">
      <PageHeader city="Mumbai" area="Bandra West" avatarInitial="B" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Search */}
        <Link href="/search" className="block mb-5">
          <div className="flex items-center gap-3 bg-white rounded-[14px] px-4 py-3.5 shadow-card border border-border hover:border-rose-gold/30 transition-colors">
            <Search className="w-5 h-5 text-text-muted" />
            <span className="font-dm text-sm text-text-muted flex-1">Search salons, services, stylists...</span>
            <div className="w-8 h-8 rounded-[10px] bg-gradient-gold flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </div>
          </div>
        </Link>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scroll pb-1 mb-6">
          {CATEGORIES.map((c) => {
            const IconComponent = CATEGORY_ICONS[c.icon]
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setActiveTag(c.name)}
                className={cn(
                  'flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full border text-sm font-dm font-medium transition-all',
                  activeTag === c.name
                    ? 'pill-active border-transparent shadow-gold'
                    : 'bg-white border-border text-text-secondary hover:border-rose-gold/40'
                )}
              >
                {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                {c.name}
              </button>
            )
          })}
        </div>

        {/* AI Recommendations */}
        <section className="mb-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-rose-gold" />
                <span className="font-dm text-[10px] font-bold tracking-[0.12em] uppercase text-rose-gold">
                  AI Recommended For You
                </span>
              </div>
              <h2 className="font-cormorant font-semibold text-2xl md:text-3xl text-luxury-black">
                Your perfect matches
              </h2>
            </div>
            <Link href="/ai" className="font-dm text-sm text-rose-gold font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Ask GlowAI <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scroll pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {recommendations.map((rec) => (
              <RecommendedSalonCard
                key={rec.salon.id}
                salon={rec.salon}
                matchPercent={rec.matchPercent}
                reason={rec.reason}
                source={rec.source}
              />
            ))}
          </div>
        </section>

        {/* All Salons (Vertical Grid instead of horizontal) */}
        <section className="mb-8">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-cormorant font-semibold text-2xl md:text-3xl text-luxury-black">
              {activeTag === 'All' ? 'All Salons' : `${activeTag} Salons`}
            </h2>
            <span className="font-dm text-sm text-text-muted font-medium">{filteredSalons.length} found</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSalons.map((s) => (
              <SalonCard key={s.id} salon={s} wide />
            ))}
            {filteredSalons.length === 0 && (
              <p className="font-dm text-text-muted col-span-full py-8 text-center">No salons found for this category.</p>
            )}
          </div>
        </section>

        {/* Trending */}
        <section className="mb-8">
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-champagne" />
              <h2 className="font-cormorant font-semibold text-2xl md:text-3xl text-luxury-black">Trending</h2>
            </div>
            <Link href="/discover" className="font-dm text-sm text-rose-gold font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {trendingServices.slice(0, 4).map((svc) => (
              <Link
                key={svc.id}
                href={`/salon/${svc.salon?.slug || mappedSalons[0].slug}`}
                className="hover-lift bg-white rounded-[18px] overflow-hidden shadow-card group"
              >
                <div className="relative h-24 md:h-28 overflow-hidden">
                  <img
                    src={svc.image_url}
                    alt={svc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/55 to-transparent" />
                  <div className="absolute bottom-2 left-2.5 font-cormorant text-sm font-semibold text-white">{svc.name}</div>
                </div>
                <div className="px-3 py-2 flex justify-between items-center">
                  <span className="font-dm text-[10px] text-text-muted uppercase tracking-wide">From</span>
                  <span className="font-cormorant font-bold text-rose-gold text-[15px]">{formatPrice(svc.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Near You */}
        <section className="mb-8">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-gold" />
              <h2 className="font-cormorant font-semibold text-2xl md:text-3xl text-luxury-black">Near You</h2>
            </div>
            <Link href="/search?sort=distance" className="font-dm text-sm text-rose-gold font-medium">Map view</Link>
          </div>
          <div className="bg-white rounded-[20px] shadow-card border border-border/50 overflow-hidden">
            {[...mappedSalons].sort((a,b) => a.distance_km - b.distance_km).slice(0, 4).map((s) => (
              <SalonCard key={s.id} salon={s} compact />
            ))}
          </div>
        </section>

        {/* GlowAI Banner */}
        <Link href="/ai" className="block mb-8">
          <div className="relative rounded-[20px] p-5 md:p-6 overflow-hidden bg-gradient-gold shadow-gold group">
            <div className="absolute right-[-30px] top-[-30px] w-40 h-40 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute left-[60%] bottom-0 w-32 h-32 rounded-full bg-white/5" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-dm text-[10px] font-bold tracking-[0.12em] uppercase text-white/75 mb-1">
                  GlowAI Assistant
                </div>
                <div className="font-cormorant font-semibold text-xl md:text-2xl text-white">
                  Chat with your personal beauty concierge
                </div>
                <div className="font-dm text-sm mt-1 text-white/80">
                  Grounded in real salons near you · streams live AI
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Loyalty */}
        <Link href="/loyalty" className="block">
          <div className="rounded-[20px] p-5 md:p-6 bg-gradient-dark shadow-luxury relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] w-36 h-36 rounded-full bg-white/5" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="font-dm text-[10px] font-bold tracking-[0.14em] uppercase text-champagne mb-1.5">
                  Glow Rewards
                </div>
                <div className="font-cormorant font-semibold text-2xl text-white">
                  2,450 Points
                </div>
                <div className="font-dm text-sm mt-1 text-white/50">
                  {formatPrice(245)} cashback available
                </div>
              </div>
              <div className="text-right">
                <div className="font-dm text-[10px] font-bold tracking-[0.08em] text-champagne uppercase">
                  Gold tier
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
