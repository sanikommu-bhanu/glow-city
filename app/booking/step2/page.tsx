'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays } from 'date-fns'
import { STYLISTS, TIME_SLOTS } from '@/lib/data'
import { useStore } from '@/store/useStore'
import BackHeader from '@/components/BackHeader'
import BookingStepBar from '@/components/BookingStepBar'

export default function BookingStep2() {
  const router = useRouter()
  const { booking, setBookingDate, setBookingTime, setBookingStylist } = useStore()
  const [selDay, setSelDay] = useState(0)
  const [bookedSlots] = useState<number[]>([2, 5, 8]) // simulate booked slots

  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i + 1)
    return { date: d, label: format(d, 'EEE'), day: format(d, 'd'), full: format(d, 'EEEE, MMM d, yyyy') }
  })

  useEffect(() => {
    setBookingDate(days[selDay].full)
  }, [selDay])

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Date & Time" backHref="/booking/step1" />
      <BookingStepBar current={2} />

      {/* Date picker */}
      <div className="px-5 mb-5">
        <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Select Date</p>
        <div className="flex gap-2.5 overflow-x-auto no-scroll pb-1">
          {days.map((d, i) => (
            <button key={i} onClick={() => setSelDay(i)}
              className="flex flex-col items-center px-3 py-2.5 rounded-[13px] cursor-pointer transition-all flex-shrink-0 border-none min-w-[52px]"
              style={{
                background: selDay === i ? 'linear-gradient(135deg,#B76E79,#D4AF7F)' : 'white',
                border: `1.5px solid ${selDay === i ? 'transparent' : '#EDD8DE'}`,
              }}>
              <span className="font-dm text-[10px] font-semibold"
                style={{ color: selDay === i ? 'rgba(255,255,255,0.75)' : '#A08088' }}>{d.label}</span>
              <span className="font-cormorant font-bold text-[20px]"
                style={{ color: selDay === i ? 'white' : '#1A1012' }}>{d.day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stylist picker */}
      <div className="px-5 mb-5">
        <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Choose Stylist</p>
        <div className="flex gap-4 overflow-x-auto no-scroll pb-1">
          {/* Any stylist */}
          <div onClick={() => setBookingStylist(null)}
            className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
            <div className="w-14 h-14 rounded-[15px] flex items-center justify-center text-[22px] transition-all"
              style={{
                background: !booking.stylist ? 'linear-gradient(135deg,#B76E79,#D4AF7F)' : '#F8E8EE',
                border: `2px solid ${!booking.stylist ? '#B76E79' : 'transparent'}`,
              }}>🎲</div>
            <span className="font-dm text-[10px] font-semibold"
              style={{ color: !booking.stylist ? '#B76E79' : '#A08088' }}>Any</span>
          </div>
          {STYLISTS.map(st => (
            <div key={st.id} onClick={() => setBookingStylist(st)}
              className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
              <img src={st.img} alt={st.name}
                className="w-14 h-14 rounded-[15px] object-cover transition-all"
                style={{ border: `2px solid ${booking.stylist?.id === st.id ? '#B76E79' : 'transparent'}` }} />
              <div className="text-center">
                <span className="font-dm text-[10px] font-semibold block"
                  style={{ color: booking.stylist?.id === st.id ? '#B76E79' : '#A08088' }}>
                  {st.name.split(' ')[0]}
                </span>
                <span className="font-dm text-[9px] text-[#D4AF7F]">★ {st.rating}</span>
              </div>
            </div>
          ))}
        </div>
        {booking.stylist && (
          <div className="mt-3 p-3 rounded-[12px] bg-white" style={{ border: '1.5px solid #EDD8DE' }}>
            <div className="font-dm text-[12px] font-semibold text-[#1A1012]">{booking.stylist.name}</div>
            <div className="font-dm text-[11px] text-[#A08088] mt-0.5">{booking.stylist.speciality}</div>
            <div className="font-dm text-[11px] text-[#6B4C52] mt-1 leading-relaxed">{booking.stylist.bio.slice(0, 80)}…</div>
          </div>
        )}
      </div>

      {/* Time slots */}
      <div className="px-5 mb-5">
        <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Available Times</p>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((t, i) => {
            const isBooked = bookedSlots.includes(i)
            const isSelected = booking.time === t
            return (
              <button key={i}
                disabled={isBooked}
                onClick={() => setBookingTime(t)}
                className="px-3.5 py-2 rounded-[10px] font-dm text-[13px] font-medium cursor-pointer transition-all border-none disabled:opacity-35 disabled:cursor-not-allowed"
                style={{
                  border: `1.5px solid ${isSelected ? '#B76E79' : '#EDD8DE'}`,
                  background: isSelected ? '#F8E8EE' : isBooked ? '#F5F5F5' : 'white',
                  color: isSelected ? '#B76E79' : isBooked ? '#ccc' : '#6B4C52',
                }}>
                {isBooked ? <s>{t}</s> : t}
              </button>
            )
          })}
        </div>
        <p className="font-dm text-[11px] text-[#A08088] mt-2">Strikethrough slots are already booked</p>
      </div>

      {/* Notes */}
      <div className="px-5 mb-4">
        <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-2">Special Requests (optional)</p>
        <textarea
          placeholder="Any allergies, preferences, or special requests…"
          rows={3}
          className="w-full rounded-[14px] border border-[#EDD8DE] bg-white px-4 py-3 font-dm text-[14px] text-[#1A1012] resize-none"
          style={{ boxShadow: 'none' }}
        />
      </div>

      <div className="h-28" />

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 glass border-t border-[#EDD8DE] z-50">
        {booking.time && (
          <div className="flex justify-between items-center mb-3">
            <span className="font-dm text-[13px] text-[#6B4C52]">{days[selDay]?.label} · {booking.time}</span>
            <span className="font-dm text-[13px] text-[#A08088]">{booking.stylist?.name || 'Any stylist'}</span>
          </div>
        )}
        <button
          disabled={!booking.time}
          onClick={() => router.push('/booking/step3')}
          className="w-full h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white disabled:opacity-40 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}>
          Continue — Review & Pay
        </button>
      </div>
    </div>
  )
}
