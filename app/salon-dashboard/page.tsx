'use client'
import { useState } from 'react'
import BackHeader from '@/components/BackHeader'

const APPOINTMENTS = [
  { name: 'Aisha Khan', service: 'Balayage Color', time: '10:30 AM', stylist: 'Priya', status: 'confirmed', price: 6500 },
  { name: 'Sneha Malhotra', service: 'Bridal Makeup', time: '1:00 PM', stylist: 'Riya', status: 'confirmed', price: 12000 },
  { name: 'Riya Patel', service: 'HydraFacial', time: '3:30 PM', stylist: 'Ananya', status: 'pending', price: 4200 },
  { name: 'Kavya Nair', service: 'Nail Art Full Set', time: '5:00 PM', stylist: 'Any', status: 'confirmed', price: 2200 },
]

const WEEK_DATA = [42000, 58000, 35000, 71000, 55000, 84000, 67000]

export default function SalonDashPage() {
  const [tab, setTab] = useState<'today' | 'analytics' | 'team'>('today')

  const totalToday = APPOINTMENTS.filter(a => a.status === 'confirmed').reduce((sum, a) => sum + a.price, 0)

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Salon Dashboard" backHref="/profile" />

      {/* Revenue hero */}
      <div className="mx-5 mb-4 rounded-[20px] p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>
        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="font-dm text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Today's Revenue</div>
        <div className="font-cormorant font-bold text-white" style={{ fontSize: 40 }}>₹{totalToday.toLocaleString()}</div>
        <div className="font-dm text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>+18% vs yesterday · 4 bookings</div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mx-5 mb-4">
        {[{ v: '14', l: 'This Week', i: '📅' }, { v: '3', l: 'Pending', i: '⏳' }, { v: '4.9★', l: 'Rating', i: '⭐' }].map(s => (
          <div key={s.l} className="bg-white rounded-[14px] p-3.5 text-center" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
            <div className="text-[20px] mb-1">{s.i}</div>
            <div className="font-cormorant font-bold text-[22px] text-[#1A1012]">{s.v}</div>
            <div className="font-dm text-[10px] uppercase tracking-wide text-[#A08088] mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex mx-5 gap-2 mb-4">
        {(['today', 'analytics', 'team'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-[10px] font-dm text-[12px] font-semibold capitalize border-none cursor-pointer transition-all"
            style={{ background: tab === t ? 'linear-gradient(135deg,#B76E79,#D4AF7F)' : 'white', color: tab === t ? 'white' : '#A08088', border: tab === t ? 'none' : '1.5px solid #EDD8DE' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'today' && (
        <div className="px-5 pb-6">
          <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Today's Appointments</p>
          {APPOINTMENTS.map((a, i) => (
            <div key={i} className="bg-white rounded-[16px] p-4 mb-3" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-bold text-[14px]"
                    style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>{a.name[0]}</div>
                  <div>
                    <div className="font-dm font-semibold text-[14px] text-[#1A1012]">{a.name}</div>
                    <div className="font-dm text-[12px] text-[#A08088] mt-0.5">{a.service}</div>
                  </div>
                </div>
                <span className={`font-dm text-[10px] font-bold uppercase px-2 py-1 rounded-full ${a.status === 'confirmed' ? 'text-green-700 bg-green-100' : 'text-orange-700 bg-orange-100'}`}>
                  {a.status}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-[#EDD8DE] pt-2.5 mt-1">
                <div className="flex gap-3">
                  <span className="font-dm text-[12px] text-[#A08088]">🕐 {a.time}</span>
                  <span className="font-dm text-[12px] text-[#A08088]">👤 {a.stylist}</span>
                </div>
                <span className="font-cormorant font-bold text-[16px]" style={{ color: '#B76E79' }}>₹{a.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'analytics' && (
        <div className="px-5 pb-6">
          <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Weekly Revenue</p>
          <div className="bg-white rounded-[18px] p-4 mb-4" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
            <div className="flex items-end gap-2 h-28">
              {WEEK_DATA.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                  <div className="rounded-t-[5px]"
                    style={{ height: `${(h / Math.max(...WEEK_DATA)) * 100}%`, background: i === 5 ? 'linear-gradient(to top,#B76E79,#D4AF7F)' : 'rgba(183,110,121,0.2)' }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="flex-1 text-center font-dm text-[10px] text-[#A08088]">{d}</div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: 'Most Popular', v: 'Balayage Color', i: '🎨' },
              { l: 'Top Stylist', v: 'Priya Sharma', i: '👑' },
              { l: 'Avg Booking Value', v: '₹4,850', i: '💰' },
              { l: 'Cancellation Rate', v: '4.2%', i: '↩️' },
            ].map(s => (
              <div key={s.l} className="bg-white rounded-[14px] p-3.5" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
                <div className="text-[20px] mb-1">{s.i}</div>
                <div className="font-dm font-semibold text-[14px] text-[#1A1012]">{s.v}</div>
                <div className="font-dm text-[10px] text-[#A08088] mt-0.5 uppercase tracking-wide">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div className="px-5 pb-6">
          {[
            { name: 'Priya Sharma', role: 'Senior Colorist', bookings: 8, rating: 4.9, status: 'On shift' },
            { name: 'Riya Mehta', role: 'Makeup Artist', bookings: 4, rating: 4.8, status: 'On shift' },
            { name: 'Ananya Verma', role: 'Spa Therapist', bookings: 2, rating: 4.7, status: 'Break' },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-[16px] p-4 mb-3 flex items-center gap-3" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white font-bold text-[16px] flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>{m.name[0]}</div>
              <div className="flex-1">
                <div className="font-cormorant font-semibold text-[17px] text-[#1A1012]">{m.name}</div>
                <div className="font-dm text-[12px] text-[#A08088]">{m.role}</div>
                <div className="flex gap-3 mt-1">
                  <span className="font-dm text-[11px] text-[#6B4C52]">📅 {m.bookings} today</span>
                  <span className="font-dm text-[11px]" style={{ color: '#D4AF7F' }}>★ {m.rating}</span>
                </div>
              </div>
              <span className={`font-dm text-[10px] font-bold px-2.5 py-1 rounded-full ${m.status === 'On shift' ? 'text-green-700 bg-green-100' : 'text-orange-700 bg-orange-100'}`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
