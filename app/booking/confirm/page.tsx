'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'

export default function BookingConfirmPage() {
  const { booking, clearBooking, user } = useStore()
  const [confCode] = useState(`GCB${Math.floor(10000 + Math.random() * 90000)}`)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const t = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="h-full overflow-y-auto no-scroll flex flex-col items-center justify-start text-center px-6 py-8"
      style={{ background: 'linear-gradient(160deg,#FDF8F5 0%,#F8E8EE 100%)' }}>

      {/* Confetti dots */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#B76E79', '#D4AF7F', '#F8E8EE', '#1A1012'][i % 4],
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `float ${1 + Math.random() * 2}s ${Math.random()}s ease-in infinite`,
                animationFillMode: 'forwards',
              }} />
          ))}
        </div>
      )}

      {/* Success icon */}
      <div className="w-24 h-24 rounded-[30px] flex items-center justify-center text-[46px] mb-6"
        style={{
          background: 'linear-gradient(135deg,#B76E79,#D4AF7F)',
          boxShadow: '0 16px 40px rgba(183,110,121,0.4)',
          animation: 'scale-in 0.6s ease-out',
        }}>✨</div>

      <h2 className="font-cormorant font-semibold tracking-tight mb-2" style={{ fontSize: 36, color: '#1A1012' }}>
        You're booked!
      </h2>
      <p className="font-dm text-[14px] leading-relaxed mb-6" style={{ color: '#6B4C52', maxWidth: 280 }}>
        Your appointment at <strong>{booking.salon?.name || 'the salon'}</strong> is confirmed and waiting for you.
      </p>

      {/* Confirmation code */}
      <div className="w-full bg-white rounded-[18px] px-5 py-4 mb-5" style={{ boxShadow: '0 8px 40px rgba(183,110,121,0.16)' }}>
        <div className="font-dm text-[10px] uppercase tracking-[0.14em] text-[#A08088] mb-1">Confirmation Code</div>
        <div className="font-cormorant font-bold text-[28px]" style={{ color: '#B76E79', letterSpacing: '0.06em' }}>{confCode}</div>
        <div className="font-dm text-[11px] text-[#A08088] mt-1">Show this at the salon</div>
      </div>

      {/* Details */}
      <div className="w-full bg-white rounded-[18px] p-4 mb-5" style={{ boxShadow: '0 8px 40px rgba(183,110,121,0.16)', textAlign: 'left' }}>
        {[
          { i: '📅', l: booking.date || 'Date TBD' },
          { i: '🕙', l: booking.time || 'Time TBD' },
          { i: booking.service?.icon || '💇‍♀️', l: booking.service?.name || 'Service' },
          { i: '👤', l: booking.stylist?.name || 'Any available stylist' },
          { i: '📍', l: booking.salon ? `${booking.salon.name}, ${booking.salon.area}` : 'Salon' },
          { i: '💎', l: `+${Math.floor((booking.service?.price || 1000) / 1000) * 200} Glow Points earned!` },
        ].map(r => (
          <div key={r.l} className="flex gap-3 py-2.5 border-b border-[#EDD8DE] last:border-0 items-center">
            <span className="text-[17px]">{r.i}</span>
            <span className="font-dm text-[13px] text-[#6B4C52]">{r.l}</span>
          </div>
        ))}
      </div>

      {/* Point earned banner */}
      <div className="w-full rounded-[16px] p-4 mb-5 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg,#1A1012,#2D1B1E)' }}>
        <div className="text-[32px]">💎</div>
        <div className="text-left">
          <div className="font-dm font-bold text-[13px]" style={{ color: '#D4AF7F' }}>Glow Points Earned!</div>
          <div className="font-cormorant font-bold text-[22px] text-white">{user.points.toLocaleString()} pts total</div>
          <div className="font-dm text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {user.tier} Member · {5000 - user.points > 0 ? `${5000 - user.points} pts to Platinum` : '🎉 Platinum achieved!'}
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <Link href="/reviews" className="flex-1">
          <button className="w-full h-12 rounded-[14px] font-dm font-semibold text-[14px] cursor-pointer transition-all"
            style={{ border: '1.5px solid #EDD8DE', background: 'white', color: '#B76E79' }}>
            ⭐ Write Review
          </button>
        </Link>
        <Link href="/home" className="flex-1">
          <button className="w-full h-12 rounded-[14px] font-dm font-semibold text-[14px] text-white cursor-pointer transition-all hover:-translate-y-0.5"
            onClick={clearBooking}
            style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}
