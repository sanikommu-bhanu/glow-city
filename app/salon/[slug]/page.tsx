import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Star, Clock, Phone, CheckCircle2 } from 'lucide-react'
import { getSalonBySlug } from '@/lib/actions/salons'
import { formatPrice } from '@/lib/types'
import { isSalonOpenNow } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import SalonTabs from '@/components/salon/SalonTabs'

export default async function SalonPage({ params }: { params: { slug: string } }) {
  const data = await getSalonBySlug(params.slug)
  if (!data) notFound()

  const { salon, services, stylists, reviews } = data
  const openNow = isSalonOpenNow(salon.hours ?? {})
  const gallery = salon.gallery_urls?.length ? salon.gallery_urls : [salon.cover_image_url].filter(Boolean)

  return (
    <div className="min-h-screen bg-warm-white pb-24">
      {/* Hero */}
      <div className="relative h-[280px] md:h-[360px] overflow-hidden">
        <Image
          src={salon.cover_image_url ?? ''}
          alt={salon.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/75 via-luxury-black/20 to-transparent" />

        <Link
          href="/home"
          className="absolute top-4 left-4 md:left-8 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-soft hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-luxury-black" />
        </Link>

        <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8 max-w-7xl">
          <div className="flex flex-wrap gap-2 mb-2">
            {salon.category.map((c) => (
              <span key={c} className="text-[10px] font-dm font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {c}
              </span>
            ))}
          </div>
          <h1 className="font-cormorant font-semibold text-white text-3xl md:text-4xl tracking-tight">{salon.name}</h1>
          <p className="font-dm text-sm text-white/75 mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {salon.area}, {salon.city}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-4 divide-x divide-border">
          {[
            { v: salon.rating, l: 'Rating', highlight: true },
            { v: salon.review_count, l: 'Reviews' },
            { v: openNow ? 'Open' : 'Closed', l: 'Now', highlight: openNow },
            { v: formatPrice(salon.price_range_min), l: 'From' },
          ].map((stat) => (
            <div key={stat.l} className="py-4 text-center">
              <div className={`font-cormorant font-bold text-lg ${stat.highlight ? 'text-champagne' : 'text-luxury-black'}`}>
                {stat.v}
              </div>
              <div className="font-dm text-[10px] uppercase tracking-wide text-text-muted mt-0.5">{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {salon.tagline && (
              <p className="font-cormorant text-xl text-rose-gold italic">{salon.tagline}</p>
            )}
            <p className="font-dm text-sm text-text-secondary leading-relaxed">{salon.about}</p>

            <div className="flex flex-wrap gap-2">
              {salon.amenities.map((a) => (
                <span key={a} className="flex items-center gap-1 text-xs font-dm px-3 py-1.5 rounded-full border border-border bg-white">
                  <CheckCircle2 className="w-3 h-3 text-rose-gold" />
                  {a}
                </span>
              ))}
            </div>

            <div className="space-y-2 text-sm font-dm text-text-muted">
              {salon.phone && (
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-rose-gold" />{salon.phone}</div>
              )}
              {salon.address && (
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-gold" />{salon.address}</div>
              )}
            </div>

            <SalonTabs
              services={services}
              stylists={stylists}
              reviews={reviews}
              gallery={gallery as string[]}
              salonSlug={salon.slug}
              salonId={salon.id}
            />
          </div>

          {/* Sidebar booking card — desktop */}
          <div className="hidden md:block">
            <div className="sticky top-24 bg-white rounded-[20px] p-6 shadow-card border border-border">
              <h3 className="font-cormorant text-xl font-semibold mb-4">Book at {salon.name}</h3>
              <div className="space-y-3 mb-6">
                {services.slice(0, 3).map((svc) => (
                  <Link
                    key={svc.id}
                    href={`/booking?salon=${salon.slug}&service=${svc.id}`}
                    className="flex justify-between items-center p-3 rounded-xl border border-border hover:border-rose-gold/40 transition-colors group"
                  >
                    <div>
                      <div className="font-dm text-sm font-semibold group-hover:text-rose-gold">{svc.name}</div>
                      <div className="font-dm text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />{svc.duration_minutes} min
                      </div>
                    </div>
                    <span className="font-cormorant font-bold text-rose-gold">{formatPrice(svc.price)}</span>
                  </Link>
                ))}
              </div>
              <Link href={`/booking?salon=${salon.slug}`}>
                <Button className="w-full" size="lg">Book Appointment</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 p-4 glass border-t border-border z-40">
        <Link href={`/booking?salon=${salon.slug}`}>
          <Button className="w-full" size="lg">Book Appointment</Button>
        </Link>
      </div>
    </div>
  )
}
