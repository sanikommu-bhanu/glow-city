'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/types'
import type { Service, Stylist, Review } from '@/lib/types'
import { cn } from '@/lib/cn'

interface SalonTabsProps {
  services: Service[]
  stylists: Stylist[]
  reviews: Review[]
  gallery: string[]
  salonSlug: string
  salonId: string
}

const TABS = ['Services', 'Photos', 'Reviews', 'Stylists'] as const

export default function SalonTabs({ services, stylists, reviews, gallery, salonSlug }: SalonTabsProps) {
  const [tab, setTab] = useState<typeof TABS[number]>('Services')

  return (
    <div>
      <div className="flex gap-1 bg-cream rounded-xl p-1 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2 rounded-lg font-dm text-xs font-semibold transition-all',
              tab === t ? 'bg-white shadow-soft text-rose-gold' : 'text-text-muted'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Services' && (
        <div className="space-y-3">
          {services.map((svc) => (
            <Link
              key={svc.id}
              href={`/booking?salon=${salonSlug}&service=${svc.id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-border hover:border-rose-gold/40 hover:shadow-soft transition-all group"
            >
              {svc.image_url && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={svc.image_url} alt={svc.name} fill className="object-cover" sizes="64px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-dm font-semibold text-sm group-hover:text-rose-gold">{svc.name}</span>
                  {svc.is_popular && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-gold text-white">Popular</span>
                  )}
                </div>
                <p className="font-dm text-xs text-text-muted mt-0.5 line-clamp-1">{svc.description}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                  <Clock className="w-3 h-3" />{svc.duration_minutes} min
                </div>
              </div>
              <span className="font-cormorant font-bold text-rose-gold text-lg">{formatPrice(svc.price)}</span>
            </Link>
          ))}
        </div>
      )}

      {tab === 'Photos' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {gallery.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={url} alt="" fill className="object-cover hover:scale-105 transition-transform" sizes="200px" />
            </div>
          ))}
        </div>
      )}

      {tab === 'Reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="font-dm text-sm text-text-muted text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-4 bg-white rounded-[16px] border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn('w-3.5 h-3.5', i < r.rating ? 'fill-champagne text-champagne' : 'text-border')} />
                    ))}
                  </div>
                  <span className="font-dm text-xs text-text-muted">Verified customer</span>
                </div>
                <p className="font-dm text-sm text-text-secondary leading-relaxed">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'Stylists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stylists.map((st) => (
            <div key={st.id} className="flex gap-3 p-4 bg-white rounded-[16px] border border-border">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-soft-pink">
                {st.image_url && <Image src={st.image_url} alt={st.name} fill className="object-cover" sizes="56px" />}
              </div>
              <div>
                <div className="font-dm font-semibold text-sm">{st.name}</div>
                <div className="font-dm text-xs text-rose-gold">{st.role}</div>
                <div className="font-dm text-xs text-text-muted mt-1">{st.speciality}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-champagne text-champagne" />
                  <span className="text-xs text-text-muted">{st.rating} · {st.experience_years} yrs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
