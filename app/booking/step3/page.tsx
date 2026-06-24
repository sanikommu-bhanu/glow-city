'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import BackHeader from '@/components/BackHeader'
import BookingStepBar from '@/components/BookingStepBar'

export default function BookingStep3() {
  const router = useRouter()
  const { booking, setBookingPayment, addPoints, user } = useStore()
  const [loading, setLoading] = useState(false)
  const [usePoints, setUsePoints] = useState(true)

  const service = booking.service
  const base = service?.price || 0
  const gst = Math.round(base * 0.18)
  const pointsDisc = usePoints ? 245 : 0
  const total = base + gst - pointsDisc

  const handlePay = async () => {
    if (!booking.salon || !booking.service || !booking.date || !booking.time) return
    setLoading(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, userId: 'user_001' }),
      })
      const data = await res.json()
      if (data.success) {
        addPoints(data.booking.pointsEarned || 200)
        router.push('/booking/confirm')
      }
    } catch {
      alert('Payment processing error. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Confirm & Pay" backHref="/booking/step2" />
      <BookingStepBar current={3} />

      <div className="px-5 pb-28">
        {/* Booking summary card */}
        <div className="bg-white rounded-[18px] p-4 mb-4" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.12)' }}>
          <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Booking Summary</p>

          {booking.salon && (
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#EDD8DE]">
              <img src={booking.salon.image} className="w-12 h-12 rounded-[12px] object-cover" alt="" />
              <div>
                <div className="font-cormorant font-semibold text-[16px] text-[#1A1012]">{booking.salon.name}</div>
                <div className="font-dm text-[12px] text-[#A08088]">📍 {booking.salon.area}</div>
              </div>
            </div>
          )}

          {[
            { l: 'Service', v: booking.service?.name || '—' },
            { l: 'Duration', v: booking.service?.duration || '—' },
            { l: 'Stylist', v: booking.stylist?.name || 'Any available' },
            { l: 'Date', v: booking.date || '—' },
            { l: 'Time', v: booking.time || '—' },
          ].map(r => (
            <div key={r.l} className="flex justify-between mb-2.5">
              <span className="font-dm text-[13px] text-[#A08088]">{r.l}</span>
              <span className="font-dm text-[13px] font-semibold text-[#1A1012]">{r.v}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-[18px] p-4 mb-4" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.12)' }}>
          <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Price Breakdown</p>
          <div className="flex justify-between mb-2"><span className="font-dm text-[13px] text-[#A08088]">Service</span><span className="font-dm text-[13px] text-[#1A1012]">₹{base.toLocaleString()}</span></div>
          <div className="flex justify-between mb-2"><span className="font-dm text-[13px] text-[#A08088]">GST (18%)</span><span className="font-dm text-[13px] text-[#1A1012]">₹{gst.toLocaleString()}</span></div>

          {/* Glow Points toggle */}
          <div className="flex justify-between items-center mb-2 p-2.5 rounded-[10px]" style={{ background: '#F8E8EE' }}>
            <div>
              <span className="font-dm text-[13px] font-semibold" style={{ color: '#B76E79' }}>Use Glow Points (2,450)</span>
              <div className="font-dm text-[11px] text-[#A08088]">Save ₹245</div>
            </div>
            <button onClick={() => setUsePoints(!usePoints)}
              className={`toggle-base ${usePoints ? 'on' : ''}`}>
              <div className="toggle-thumb" />
            </button>
          </div>

          {usePoints && (
            <div className="flex justify-between mb-2">
              <span className="font-dm text-[13px]" style={{ color: '#4CAF50' }}>Points Discount</span>
              <span className="font-dm text-[13px] font-semibold" style={{ color: '#4CAF50' }}>-₹{pointsDisc}</span>
            </div>
          )}

          <div className="flex justify-between pt-3 border-t border-[#EDD8DE] mt-1">
            <span className="font-dm font-bold text-[15px] text-[#1A1012]">Total</span>
            <span className="font-cormorant font-bold text-[24px]" style={{ color: '#B76E79' }}>₹{total.toLocaleString()}</span>
          </div>

          <div className="mt-2 font-dm text-[11px] text-[#A08088] text-right">
            You'll earn ~{Math.floor(base / 1000) * 200} Glow Points with this booking 💎
          </div>
        </div>

        {/* Payment method */}
        <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Payment Method</p>
        {[
          { k: 'card' as const, l: 'Credit / Debit Card', i: '💳', sub: 'All major cards accepted' },
          { k: 'upi' as const, l: 'UPI / Google Pay / PhonePe', i: '📲', sub: 'Instant, no charges' },
          { k: 'wallet' as const, l: 'Glow Wallet', i: '💰', sub: `Balance: ₹${user.points > 0 ? 500 : 0}` },
        ].map(m => (
          <div key={m.k} onClick={() => setBookingPayment(m.k)}
            className="flex items-center gap-3.5 p-3.5 bg-white rounded-[14px] mb-2.5 cursor-pointer transition-all"
            style={{
              border: `1.5px solid ${booking.paymentMethod === m.k ? '#B76E79' : '#EDD8DE'}`,
              boxShadow: booking.paymentMethod === m.k ? '0 0 0 3px rgba(183,110,121,0.1)' : 'none',
            }}>
            <span className="text-[22px]">{m.i}</span>
            <div className="flex-1">
              <div className="font-dm font-medium text-[14px] text-[#1A1012]">{m.l}</div>
              <div className="font-dm text-[11px] text-[#A08088] mt-0.5">{m.sub}</div>
            </div>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-white flex-shrink-0"
              style={{
                border: `2px solid ${booking.paymentMethod === m.k ? '#B76E79' : '#EDD8DE'}`,
                background: booking.paymentMethod === m.k ? '#B76E79' : 'white',
              }}>
              {booking.paymentMethod === m.k ? '✓' : ''}
            </div>
          </div>
        ))}

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {['🔒 Secure Payment', '↩️ Free Cancellation', '✅ Instant Confirm'].map(badge => (
            <span key={badge} className="font-dm text-[10px] text-[#A08088]">{badge}</span>
          ))}
        </div>
      </div>

      {/* Pay CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 glass border-t border-[#EDD8DE] z-50">
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white disabled:opacity-60 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}>
          {loading ? '⏳ Processing…' : `🔒  Pay ₹${total.toLocaleString()} Securely`}
        </button>
      </div>
    </div>
  )
}
