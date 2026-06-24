'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Heart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatDistance } from '@/lib/utils'
import { formatPrice } from '@/lib/types'
import type { Salon } from '@/lib/types'

interface SalonCardProps {
  salon: Salon
  wide?: boolean
  compact?: boolean
  matchPercent?: number
  reason?: string
  showMatch?: boolean
}

export default function SalonCard({
  salon,
  wide,
  compact,
  matchPercent,
  reason,
  showMatch,
}: SalonCardProps) {
  const href = `/salon/${salon.slug}`
  const priceLabel = salon.price_range_min ? `From ${formatPrice(salon.price_range_min)}` : ''

  if (compact) {
    return (
      <Link href={href} className="block group">
        <div className="flex gap-3.5 items-center py-3 px-4 md:px-0 cursor-pointer border-b border-border/50 hover:bg-rose-gold/3 transition-colors">
          <div className="relative w-[70px] h-[70px] rounded-[14px] overflow-hidden flex-shrink-0">
            <Image
              src={salon.cover_image_url ?? '/placeholder-salon.jpg'}
              alt={salon.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="70px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-cormorant text-[17px] font-semibold text-luxury-black truncate">{salon.name}</div>
            <div className="flex items-center gap-1 text-[12px] text-text-muted mt-0.5">
              <MapPin className="w-3 h-3" />
              {salon.area}
              {salon.distance_km != null && (
                <span className="text-rose-gold ml-1">· {formatDistance(salon.distance_km)}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Star className="w-3 h-3 fill-champagne text-champagne" />
              <span className="text-[12px] text-text-muted">{salon.rating} ({salon.review_count})</span>
            </div>
          </div>
          <span className="font-cormorant font-bold text-rose-gold text-[15px] flex-shrink-0">{priceLabel}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className={cn('block group', wide ? 'w-full' : 'w-[240px] md:w-[260px] flex-shrink-0')}>
      <article
        className="hover-lift bg-white rounded-[20px] overflow-hidden h-full"
        style={{ boxShadow: '0 8px 40px rgba(183,110,121,0.16)' }}
      >
        <div className="relative h-[160px] md:h-[180px] overflow-hidden">
          <Image
            src={salon.cover_image_url ?? '/placeholder-salon.jpg'}
            alt={salon.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="260px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent" />
          {showMatch && matchPercent && (
            <span className="absolute top-2.5 left-2.5 match-badge text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full text-rose-gold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {matchPercent}% match
            </span>
          )}
          {salon.verified && !showMatch && (
            <span className="absolute top-2.5 left-2.5 bg-gradient-gold text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
              Verified
            </span>
          )}
          {salon.distance_km != null && (
            <span className="absolute bottom-2.5 right-2.5 text-white text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
              {formatDistance(salon.distance_km)}
            </span>
          )}
        </div>
        <div className="p-3.5">
          <div className="font-cormorant text-[18px] font-semibold text-luxury-black mb-1 line-clamp-1">{salon.name}</div>
          <div className="flex items-center gap-1 text-[12px] text-text-muted mb-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{salon.area}</span>
          </div>
          {reason && (
            <p className="text-[11px] text-text-secondary mb-2 line-clamp-2 leading-relaxed">{reason}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-champagne text-champagne" />
              <span className="text-[12px] text-text-muted">{salon.rating} ({salon.review_count})</span>
            </div>
            <span className="font-cormorant font-bold text-rose-gold text-[16px]">{priceLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function RecommendedSalonCard({
  salon,
  matchPercent,
  reason,
  source,
}: {
  salon: Salon
  matchPercent: number
  reason: string
  source: 'activity' | 'onboarding' | 'trending'
}) {
  return (
    <div className="relative">
      <SalonCard salon={salon} matchPercent={matchPercent} reason={reason} showMatch />
      <span className="absolute -top-2 right-3 text-[9px] font-dm font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream text-text-muted border border-border">
        {source === 'onboarding' ? 'From onboarding' : source === 'activity' ? 'From your activity' : 'Trending'}
      </span>
    </div>
  )
}
