'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, CreditCard, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import BookingStepBar from '@/components/BookingStepBar'
import { SALONS, SERVICES, STYLISTS } from '@/lib/data'
import { slugify } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import type { Service, Stylist } from '@/lib/types'

function BookingFlow() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const salonSlug = searchParams.get('salon') ?? ''
  const preselectedService = searchParams.get('service')

  const [step, setStep] = useState(preselectedService ? 2 : 1)
  const [salon, setSalon] = useState<any>(null)
  const [services, setServices] = useState<Service[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [loyaltyRedeem, setLoyaltyRedeem] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user, setBooking } = useStore()

  useEffect(() => {
    if (!salonSlug) return
    const localSalon = SALONS.find(s => slugify(s.name) === salonSlug)
    if (!localSalon) return

    const mappedSalon = {
      id: localSalon.id.toString(),
      name: localSalon.name,
      slug: slugify(localSalon.name),
      area: localSalon.area,
      cover_image_url: localSalon.image,
    }
    setSalon(mappedSalon)

    const mappedServices = SERVICES.map(s => ({
      id: s.id.toString(),
      name: s.name,
      duration_minutes: parseInt(s.duration) || 60,
      price: s.price,
      category: s.category,
      icon: s.icon,
    }))
    setServices(mappedServices as any)

    const mappedStylists = STYLISTS.map(s => ({
      id: s.id.toString(),
      name: s.name,
      role: s.role,
      avatar_url: s.img,
    }))
    setStylists(mappedStylists as any)

    if (preselectedService) {
      const svc = mappedServices.find((s) => s.id === preselectedService)
      if (svc) setSelectedService(svc as any)
    }
  }, [salonSlug, preselectedService])

  useEffect(() => {
    if (!selectedStylist || !date || !selectedService || !salon) return
    // Mock slots
    setSlots(['10:00 AM', '11:30 AM', '02:00 PM', '04:15 PM', '06:00 PM'])
  }, [selectedStylist, date, selectedService, salon])

  async function handlePayment() {
    if (!selectedService || !selectedStylist || !date || !time || !salon) return
    setLoading(true)

    // Simulate payment & booking logic locally
    setTimeout(() => {
      setBooking({
        salon,
        service: selectedService,
        stylist: selectedStylist,
        date,
        time,
      })
      toast.success('Payment successful! Booking confirmed.')
      setLoading(false)
      router.push(`/booking/confirm`)
    }, 1500)
  }

  const platformFee = selectedService ? Math.round(selectedService.price * 0.05) : 0
  const total = selectedService ? selectedService.price + platformFee - loyaltyRedeem : 0
  const minDate = new Date().toISOString().split('T')[0]

  if (!salonSlug) {
    return (
      <div className="p-8 text-center font-dm text-text-muted">
        Select a salon to book. <Link href="/search" className="text-rose-gold">Browse salons</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-white pb-24">
      <div className="glass border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/salon/${salonSlug}`} className="p-2 rounded-xl hover:bg-rose-gold/8">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-cormorant text-xl font-semibold">Book Appointment</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <BookingStepBar current={step} />

        {salon && (
          <div className="mb-6 p-4 bg-white rounded-[16px] border border-border flex items-center gap-3">
            {salon.cover_image_url && (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                <Image src={salon.cover_image_url} alt="" fill className="object-cover" sizes="48px" />
              </div>
            )}
            <div>
              <div className="font-cormorant font-semibold">{salon.name}</div>
              <div className="font-dm text-xs text-text-muted">{salon.area}</div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3 animate-fade-up">
            <h2 className="font-cormorant text-xl mb-4">Select Service</h2>
            {services.map((svc) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => { setSelectedService(svc); setStep(2) }}
                className="w-full flex items-center justify-between p-4 bg-white rounded-[14px] border border-border hover:border-rose-gold/40 text-left transition-all"
              >
                <div>
                  <div className="font-dm font-semibold text-sm flex items-center gap-2">
                    <span className="text-xl">{svc.icon}</span> {svc.name}
                  </div>
                  <div className="font-dm text-xs text-text-muted ml-8">{svc.duration_minutes} min</div>
                </div>
                <span className="font-cormorant font-bold text-rose-gold">{formatPrice(svc.price)}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && selectedService && (
          <div className="space-y-6 animate-fade-up">
            <div className="p-3 bg-soft-pink/50 rounded-xl font-dm text-sm flex items-center gap-2">
              <span className="text-xl">{selectedService.icon}</span>
              {selectedService.name} · {formatPrice(selectedService.price)}
            </div>

            <div>
              <h2 className="font-cormorant text-xl mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-gold" /> Pick a date
              </h2>
              <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => { setDate(e.target.value); setTime('') }}
                className="w-full rounded-[14px] border border-border px-4 py-3 font-dm text-sm outline-none focus:border-rose-gold"
              />
            </div>

            <div>
              <h2 className="font-cormorant text-xl mb-3">Choose stylist</h2>
              <div className="grid grid-cols-2 gap-2">
                {stylists.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStylist(st)}
                    className={`p-3 rounded-xl border text-left font-dm text-sm transition-all ${selectedStylist?.id === st.id ? 'border-rose-gold bg-rose-gold/8' : 'border-border bg-white hover:border-rose-gold/40'}`}
                  >
                    <div className="font-semibold">{st.name}</div>
                    <div className="text-xs text-text-muted">{st.role}</div>
                  </button>
                ))}
              </div>
            </div>

            {date && selectedStylist && (
              <div className="animate-fade-up">
                <h2 className="font-cormorant text-xl mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-gold" /> Time slot
                </h2>
                {slots.length === 0 ? (
                  <p className="font-dm text-sm text-text-muted">No slots available this day.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTime(s)}
                        className={`py-2 rounded-xl border text-xs font-dm font-medium transition-all ${time === s ? 'pill-active' : 'border-border bg-white hover:border-rose-gold/40'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-full"
              disabled={!date || !selectedStylist || !time}
              onClick={() => setStep(3)}
            >
              Review & Pay
            </Button>
          </div>
        )}

        {step === 3 && selectedService && (
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-cormorant text-xl flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-gold" /> Payment Summary
            </h2>

            <div className="bg-white rounded-[16px] border border-border p-4 space-y-3 font-dm text-sm">
              <div className="flex justify-between"><span>Service</span><span>{formatPrice(selectedService.price)}</span></div>
              <div className="flex justify-between text-text-muted"><span>Platform fee</span><span>{formatPrice(platformFee)}</span></div>
              {loyaltyRedeem > 0 && (
                <div className="flex justify-between text-rose-gold"><span>Loyalty discount</span><span>-{formatPrice(loyaltyRedeem)}</span></div>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span><span className="font-cormorant text-rose-gold text-xl">{formatPrice(total)}</span>
              </div>
            </div>

            {user && user.points > 0 && (
              <div className="p-4 bg-gradient-dark rounded-[16px] text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-champagne" />
                  <span className="font-dm text-sm">Redeem loyalty points</span>
                </div>
                <p className="font-dm text-xs text-white/60 mb-3">{user.points} points available (max {Math.min(user.points, Math.floor(selectedService.price * 0.2))})</p>
                <input
                  type="range"
                  min={0}
                  max={Math.min(user.points, Math.floor(selectedService.price * 0.2))}
                  value={loyaltyRedeem}
                  onChange={(e) => setLoyaltyRedeem(Number(e.target.value))}
                  className="w-full"
                />
                <p className="font-dm text-xs mt-1 text-champagne">Redeeming {loyaltyRedeem} pts (−{formatPrice(loyaltyRedeem)})</p>
              </div>
            )}

            <Button className="w-full" size="lg" loading={loading} onClick={handlePayment}>
              Pay & Confirm Booking
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-dm">Loading booking...</div>}>
      <BookingFlow />
    </Suspense>
  )
}
