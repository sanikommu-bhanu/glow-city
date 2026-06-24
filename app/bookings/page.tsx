'use client'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatPrice } from '@/lib/types'

export default function BookingsPage() {
  const { appointments } = useStore()

  return (
    <div className="min-h-screen bg-[#FDF8F5] pb-24 h-full overflow-y-auto no-scroll">
      <div className="glass border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/profile" className="p-2 rounded-xl hover:bg-rose-gold/8 transition-colors">
            <ArrowLeft className="w-5 h-5 text-luxury-black" />
          </Link>
          <h1 className="font-cormorant text-2xl font-semibold text-luxury-black tracking-tight">My Bookings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center pt-12">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl mx-auto mb-4 border border-border">
              📅
            </div>
            <h2 className="font-cormorant font-semibold text-xl text-luxury-black mb-2">No bookings yet</h2>
            <p className="font-dm text-sm text-text-muted mb-6">Looks like you haven't booked any appointments.</p>
            <Link href="/home">
              <button className="px-6 py-2.5 rounded-xl bg-rose-gold text-white font-dm text-sm font-semibold hover:-translate-y-0.5 transition-all shadow-md">
                Explore Salons
              </button>
            </Link>
          </div>
        ) : (
          appointments.sort((a, b) => b.createdAt - a.createdAt).map(apt => (
            <div key={apt.id} className="bg-white rounded-[20px] border border-border p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-dm text-[10px] text-text-muted mb-1 tracking-wider">#{apt.id}</div>
                  <div className="font-cormorant font-bold text-[22px] text-luxury-black leading-tight">{apt.salon?.name}</div>
                  <div className="font-dm text-[13px] text-text-secondary mt-0.5">{apt.salon?.area}</div>
                </div>
                <div className="px-3 py-1.5 rounded-full text-[10px] font-dm font-bold uppercase tracking-wider"
                  style={{
                    background: apt.status === 'upcoming' ? 'rgba(183,110,121,0.1)' : '#f3f4f6',
                    color: apt.status === 'upcoming' ? '#B76E79' : '#9ca3af'
                  }}>
                  {apt.status}
                </div>
              </div>
              
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center gap-2 font-dm text-[14px] text-text-secondary">
                  <Calendar className="w-4 h-4 text-rose-gold" /> {apt.date}
                </div>
                <div className="flex items-center gap-2 font-dm text-[14px] text-text-secondary">
                  <Clock className="w-4 h-4 text-rose-gold" /> {apt.time}
                </div>
                <div className="flex items-center gap-2 font-dm text-[14px] text-text-secondary">
                  <span className="w-4 h-4 flex items-center justify-center text-xs">👤</span> {apt.stylist?.name}
                </div>
                
                <div className="flex justify-between items-center font-dm text-[15px] mt-4 pt-3 border-t border-border border-dashed">
                  <span className="flex items-center gap-2 font-medium text-luxury-black">
                    <span>{apt.service?.icon}</span> {apt.service?.name}
                  </span>
                  <span className="font-cormorant font-bold text-[18px] text-rose-gold">{formatPrice(apt.service?.price || 0)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
