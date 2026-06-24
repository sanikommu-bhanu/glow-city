'use client'
import { useState } from 'react'
import BackHeader from '@/components/BackHeader'

const STATS = [
  { v: '2,841', l: 'Total Bookings', change: '+12%', icon: '📅', color: '#B76E79' },
  { v: '₹18.4L', l: 'Revenue MTD', change: '+23%', icon: '💰', color: '#D4AF7F' },
  { v: '498', l: 'Active Salons', change: '+5', icon: '🏪', color: '#7FFF9F' },
  { v: '4.85', l: 'Avg Rating', change: '+0.02', icon: '⭐', color: '#87CEEB' },
  { v: '52,400', l: 'App Users', change: '+1.2k', icon: '👥', color: '#FFB3C6' },
  { v: '38%', l: 'Repeat Bookings', change: '+4%', icon: '🔄', color: '#C8B6FF' },
]

const RECENT = [
  { icon: '🏪', text: 'New salon onboarded: The Brow Bar, Andheri', time: '5m ago', type: 'success' },
  { icon: '📈', text: 'Booking spike detected: +34% Saturday vs last week', time: '22m ago', type: 'info' },
  { icon: '⚠️', text: 'User report flagged: Booking #8821 — under review', time: '1h ago', type: 'warning' },
  { icon: '💸', text: 'Payout processed: ₹2.1L to 42 salons', time: '2h ago', type: 'success' },
  { icon: '🤖', text: 'AI assistant served 1,240 queries today', time: '3h ago', type: 'info' },
  { icon: '🎁', text: 'Weekend offer campaign activated — 3,400 users notified', time: '5h ago', type: 'success' },
]

const TOP_SALONS = [
  { name: 'Maison de Belle', bookings: 84, revenue: '₹3.5L', rating: 4.9 },
  { name: 'Lumière Studio', bookings: 71, revenue: '₹2.8L', rating: 4.9 },
  { name: 'Aurore Spa', bookings: 65, revenue: '₹2.1L', rating: 4.8 },
  { name: 'Velvet & Gold', bookings: 58, revenue: '₹1.4L', rating: 4.7 },
]

export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'salons' | 'users'>('overview')

  return (
    <div className="h-full overflow-y-auto no-scroll" style={{ background: '#1A1012' }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <BackHeader title="" backHref="/profile" />
          <span className="font-cormorant font-semibold text-white" style={{ fontSize: 20 }}>Admin Panel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="font-dm text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Live</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mx-5 gap-2 mt-4">
        {(['overview', 'salons', 'users'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-[10px] font-dm text-[12px] font-semibold capitalize border-none cursor-pointer transition-all"
            style={{ background: tab === t ? 'linear-gradient(135deg,#B76E79,#D4AF7F)' : 'rgba(255,255,255,0.06)', color: tab === t ? 'white' : 'rgba(255,255,255,0.5)' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="px-5 pb-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 mb-5">
            {STATS.map(s => (
              <div key={s.l} className="rounded-[16px] p-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[20px]">{s.icon}</span>
                  <span className="font-dm text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(76,175,80,0.15)', color: '#4CAF50' }}>{s.change}</span>
                </div>
                <div className="font-cormorant font-bold" style={{ fontSize: 26, color: s.color }}>{s.v}</div>
                <div className="font-dm text-[10px] uppercase tracking-[0.08em] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Revenue bar chart visual */}
          <div className="rounded-[18px] p-4 mb-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="font-cormorant font-semibold text-white mb-4" style={{ fontSize: 18 }}>Weekly Revenue</div>
            <div className="flex items-end gap-2 h-24">
              {[45, 62, 38, 71, 55, 84, 67].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-[4px] flex flex-col justify-end">
                  <div className="rounded-t-[4px]" style={{ height: `${h}%`, background: i === 5 ? 'linear-gradient(135deg,#B76E79,#D4AF7F)' : 'rgba(183,110,121,0.3)' }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="flex-1 text-center font-dm text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{d}</div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="font-cormorant font-semibold text-white mb-3" style={{ fontSize: 18 }}>Recent Activity</div>
          {RECENT.map((a, i) => (
            <div key={i} className="flex gap-3 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="text-[18px] flex-shrink-0">{a.icon}</span>
              <div className="flex-1">
                <div className="font-dm text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{a.text}</div>
                <div className="font-dm text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'salons' && (
        <div className="px-5 mt-4 pb-8">
          <div className="font-cormorant font-semibold text-white mb-3" style={{ fontSize: 18 }}>Top Performing Salons</div>
          {TOP_SALONS.map((s, i) => (
            <div key={i} className="rounded-[16px] p-4 mb-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-cormorant font-semibold text-white" style={{ fontSize: 16 }}>#{i + 1} {s.name}</div>
                  <div className="font-dm text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.bookings} bookings this month</div>
                </div>
                <div className="text-right">
                  <div className="font-cormorant font-bold" style={{ fontSize: 18, color: '#D4AF7F' }}>{s.revenue}</div>
                  <div className="font-dm text-[11px]" style={{ color: '#D4AF7F' }}>★ {s.rating}</div>
                </div>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: `${(s.bookings / 100) * 100}%`, background: 'linear-gradient(90deg,#B76E79,#D4AF7F)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="px-5 mt-4 pb-8">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[{ v: '52,400', l: 'Total Users', c: '#B76E79' }, { v: '8,240', l: 'Active Today', c: '#D4AF7F' }, { v: '34%', l: 'Gold+ Tier', c: '#7FFF9F' }, { v: '12.4', l: 'Avg Sessions/mo', c: '#87CEEB' }].map(s => (
              <div key={s.l} className="rounded-[14px] p-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-cormorant font-bold" style={{ fontSize: 24, color: s.c }}>{s.v}</div>
                <div className="font-dm text-[10px] uppercase tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="font-cormorant font-semibold text-white mb-3" style={{ fontSize: 18 }}>Recent Signups</div>
          {['Aisha Khan · Bandra', 'Sneha Malhotra · Juhu', 'Kavya Nair · Worli', 'Riya Patel · Powai', 'Divya Shah · Colaba'].map((u, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-bold text-[13px]"
                style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>{u[0]}</div>
              <div className="font-dm text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{u}</div>
              <div className="ml-auto font-dm text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>just now</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
