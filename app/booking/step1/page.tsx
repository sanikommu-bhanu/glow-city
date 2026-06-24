'use client'
import { useRouter } from 'next/navigation'
import { SERVICES } from '@/lib/data'
import { useStore } from '@/store/useStore'
import BackHeader from '@/components/BackHeader'
import BookingStepBar from '@/components/BookingStepBar'

export default function BookingStep1() {
  const router = useRouter()
  const { booking, setBookingService } = useStore()

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Select Service" backHref="/home" />
      <BookingStepBar current={1} />

      {/* Salon summary if selected */}
      {booking.salon && (
        <div className="mx-5 mb-4 p-3.5 bg-white rounded-[16px] flex items-center gap-3"
          style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)', border: '1.5px solid #EDD8DE' }}>
          <img src={booking.salon.image} className="w-12 h-12 rounded-[12px] object-cover" alt="" />
          <div>
            <div className="font-cormorant font-semibold text-[16px] text-[#1A1012]">{booking.salon.name}</div>
            <div className="font-dm text-[12px] text-[#A08088]">📍 {booking.salon.area}</div>
          </div>
        </div>
      )}

      <p className="px-5 font-dm text-[13px] text-[#A08088] mb-3">Choose your service</p>

      {/* Group by category */}
      {['Hair', 'Makeup', 'Spa', 'Skin', 'Nails'].map(cat => {
        const catServices = SERVICES.filter(s => s.category === cat)
        return (
          <div key={cat}>
            <div className="px-5 py-1.5">
              <span className="font-dm text-[10px] font-bold uppercase tracking-[0.1em] text-[#A08088]">{cat}</span>
            </div>
            {catServices.map(sv => {
              const isSelected = booking.service?.id === sv.id
              return (
                <div key={sv.id}
                  onClick={() => setBookingService(sv)}
                  className="mx-5 mb-2.5 p-3.5 bg-white rounded-[14px] flex items-center justify-between cursor-pointer transition-all"
                  style={{
                    border: `1.5px solid ${isSelected ? '#B76E79' : '#EDD8DE'}`,
                    boxShadow: isSelected ? '0 0 0 3px rgba(183,110,121,0.1)' : 'none',
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[20px] flex-shrink-0"
                      style={{ background: '#F8E8EE' }}>{sv.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-dm font-semibold text-[15px] text-[#1A1012]">{sv.name}</span>
                        {sv.popular && (
                          <span className="font-dm text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>Popular</span>
                        )}
                      </div>
                      <div className="font-dm text-[12px] text-[#A08088] mt-0.5">⏱ {sv.duration}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-cormorant font-bold text-[17px]" style={{ color: '#B76E79' }}>
                      ₹{sv.price.toLocaleString()}
                    </span>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-white"
                      style={{
                        border: `2px solid ${isSelected ? '#B76E79' : '#EDD8DE'}`,
                        background: isSelected ? '#B76E79' : 'white',
                      }}>
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      <div className="h-28" />

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 glass border-t border-[#EDD8DE] z-50">
        {booking.service && (
          <div className="flex justify-between items-center mb-3">
            <span className="font-dm text-[13px] text-[#6B4C52]">{booking.service.name}</span>
            <span className="font-cormorant font-bold text-[17px]" style={{ color: '#B76E79' }}>
              ₹{booking.service.price.toLocaleString()}
            </span>
          </div>
        )}
        <button
          disabled={!booking.service}
          onClick={() => router.push('/booking/step2')}
          className="w-full h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white disabled:opacity-40 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}>
          Continue — Choose Date & Time
        </button>
      </div>
    </div>
  )
}
