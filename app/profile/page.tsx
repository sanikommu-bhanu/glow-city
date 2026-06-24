'use client'
import Link from 'next/link'
import { useStore } from '@/store/useStore'

export default function ProfilePage() {
  const { user } = useStore()

  const TIER_COLORS = { Silver: '#94A3B8', Gold: '#D4AF7F', Platinum: '#E5E7EB' }
  const tierColor = TIER_COLORS[user.tier] || '#D4AF7F'

  const menuGroups = [
    {
      label: 'My Activity',
      items: [
        { i: '📅', l: 'My Bookings', href: '/booking/confirm', badge: '1 upcoming' },
        { i: '❤️', l: 'Favourites', href: '/favorites' },
        { i: '⭐', l: 'My Reviews', href: '/reviews' },
      ],
    },
    {
      label: 'Rewards',
      items: [
        { i: '💎', l: 'Glow Rewards', href: '/loyalty', badge: `${user.points.toLocaleString()} pts` },
        { i: '🎁', l: 'Special Offers', href: '/notifications' },
      ],
    },
    {
      label: 'Account',
      items: [
        { i: '🔔', l: 'Notifications', href: '/notifications' },
        { i: '⚙️', l: 'Settings', href: '/settings' },
        { i: '🔒', l: 'Privacy & Security', href: '/settings' },
      ],
    },
    {
      label: 'More',
      items: [
        { i: 'ℹ️', l: 'About GlowCity', href: '/about' },
        { i: '💬', l: 'Help & FAQ', href: '/faq' },
        { i: '📞', l: 'Contact Support', href: '/contact' },
        { i: '📊', l: 'Salon Dashboard', href: '/salon-dashboard' },
        { i: '🛡️', l: 'Admin Panel', href: '/admin' },
      ],
    },
  ]

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5] pb-24">
      {/* Hero banner */}
      <div className="relative overflow-hidden px-6 pt-10 pb-20"
        style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>
        <div className="absolute right-[-30px] top-[-30px] w-44 h-44 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute left-[-20px] bottom-[-20px] w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 rounded-[24px] flex items-center justify-center text-[34px] mx-auto mb-3"
            style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
            👤
          </div>
          <div className="font-cormorant font-semibold text-white" style={{ fontSize: 24 }}>{user.name}</div>
          <div className="font-dm text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>{user.email}</div>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.18)' }}>
            <span style={{ color: tierColor, fontSize: 14 }}>💎</span>
            <span className="font-dm text-[11px] font-bold text-white tracking-[0.1em]">{user.tier.toUpperCase()} MEMBER</span>
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div className="mx-5 -mt-10 bg-white rounded-[20px] p-5 flex"
        style={{ boxShadow: '0 8px 40px rgba(183,110,121,0.16)' }}>
        {[
          { v: user.totalBookings, l: 'Bookings' },
          { v: user.points.toLocaleString(), l: 'Points' },
          { v: `₹${user.totalSaved.toLocaleString()}`, l: 'Saved' },
        ].map(s => (
          <div key={s.l} className="flex-1 text-center">
            <div className="font-cormorant font-bold text-[26px] text-[#1A1012]">{s.v}</div>
            <div className="font-dm text-[10px] uppercase tracking-[0.08em] text-[#A08088] mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Points progress */}
      <div className="mx-5 mt-4 p-4 rounded-[16px]" style={{ background: 'linear-gradient(135deg,#1A1012,#2D1B1E)' }}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="font-dm text-[10px] uppercase tracking-[0.12em]" style={{ color: '#D4AF7F' }}>Progress to Platinum</div>
            <div className="font-cormorant font-bold text-[20px] text-white mt-0.5">{user.points.toLocaleString()} / 5,000 pts</div>
          </div>
          <div className="text-[28px]">💎</div>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <div className="h-full rounded-full transition-all" style={{
            width: `${Math.min(100, (user.points / 5000) * 100)}%`,
            background: 'linear-gradient(90deg,#B76E79,#D4AF7F)',
          }} />
        </div>
        <div className="font-dm text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {Math.max(0, 5000 - user.points)} points to Platinum
        </div>
      </div>

      {/* Menu groups */}
      <div className="px-5 mt-4">
        {menuGroups.map(group => (
          <div key={group.label} className="mb-4">
            <p className="font-dm text-[10px] font-bold uppercase tracking-[0.12em] text-[#A08088] mb-2 pl-1">{group.label}</p>
            <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
              {group.items.map((item, idx) => (
                <Link key={item.l} href={item.href}>
                  <div className={`flex items-center gap-3.5 px-4 py-3.5 cursor-pointer hover:bg-[rgba(183,110,121,0.03)] transition-colors ${idx < group.items.length - 1 ? 'border-b border-[#EDD8DE]' : ''}`}>
                    <span className="text-[19px] w-7 text-center">{item.i}</span>
                    <span className="flex-1 font-dm text-[15px] font-medium text-[#1A1012]">{item.l}</span>
                    {(item as any).badge && (
                      <span className="font-dm text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>
                        {(item as any).badge}
                      </span>
                    )}
                    <span className="text-[#A08088] text-[18px]">›</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <Link href="/auth/login">
          <button className="w-full py-4 rounded-[14px] font-dm font-semibold text-[14px] cursor-pointer mt-2 transition-all hover:opacity-90"
            style={{ border: '1.5px solid #F2D5DC', background: 'white', color: '#C9848E' }}>
            Sign Out
          </button>
        </Link>
        <p className="font-dm text-[11px] text-center text-[#A08088] mt-4">GlowCity AI v1.0.0 · Made with ❤️ in Mumbai</p>
      </div>
    </div>
  )
}
