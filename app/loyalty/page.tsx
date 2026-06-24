'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import BackHeader from '@/components/BackHeader'

const REDEEM = [
  { pts: 500, label: '₹50 off next booking', icon: '🎟️', available: true },
  { pts: 1000, label: 'Free blowdry (₹1,800 value)', icon: '💇‍♀️', available: true },
  { pts: 2000, label: '15% off any service', icon: '✂️', available: true },
  { pts: 3000, label: 'Free Gold Facial (₹3,200 value)', icon: '🌟', available: false },
  { pts: 5000, label: 'Free Bridal Makeup (₹12,000 value)', icon: '💄', available: false },
]

const EARN = [
  { i: '📅', t: 'Book a service', p: '+200 pts per ₹1,000' },
  { i: '⭐', t: 'Write a review', p: '+50 pts' },
  { i: '👥', t: 'Refer a friend', p: '+500 pts each' },
  { i: '📸', t: 'Share on Instagram', p: '+100 pts' },
  { i: '🎂', t: 'Birthday bonus', p: '+1,000 pts' },
  { i: '🔔', t: 'Enable notifications', p: '+25 pts (one-time)' },
]

export default function LoyaltyPage() {
  const { user, addPoints } = useStore()
  const [redeemed, setRedeemed] = useState<number[]>([])
  const [tab, setTab] = useState<'redeem' | 'earn' | 'history'>('redeem')

  const handleRedeem = (pts: number, idx: number) => {
    if (user.points >= pts && !redeemed.includes(idx)) {
      addPoints(-pts)
      setRedeemed(r => [...r, idx])
    }
  }

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Glow Rewards" backHref="/profile" />

      {/* Balance card */}
      <div className="mx-5 mb-5 rounded-[22px] p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 12px 40px rgba(183,110,121,0.35)' }}>
        <div className="absolute right-[-25px] top-[-25px] w-36 h-36 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute left-[-15px] bottom-[-15px] w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="relative z-10">
          <div className="font-dm text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>Your Balance</div>
          <div className="font-cormorant font-bold text-white" style={{ fontSize: 52, lineHeight: 1 }}>{user.points.toLocaleString()}</div>
          <div className="font-dm text-[14px] mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Glow Points · 💎 {user.tier} Tier</div>

          {/* Tier progress */}
          <div className="mt-4">
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (user.points / 5000) * 100)}%`, background: 'rgba(255,255,255,0.7)' }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="font-dm text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{user.points.toLocaleString()} pts</span>
              <span className="font-dm text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>5,000 for Platinum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mx-5 gap-2 mb-4">
        {(['redeem', 'earn', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-[12px] font-dm text-[12px] font-semibold border-none cursor-pointer capitalize transition-all"
            style={{
              background: tab === t ? 'linear-gradient(135deg,#B76E79,#D4AF7F)' : 'white',
              color: tab === t ? 'white' : '#A08088',
              boxShadow: tab === t ? '0 4px 12px rgba(183,110,121,0.3)' : '0 2px 8px rgba(183,110,121,0.08)',
            }}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 pb-6">
        {/* Redeem tab */}
        {tab === 'redeem' && (
          <div>
            <p className="font-dm text-[12px] text-[#A08088] mb-3">Tap to redeem — instantly applied to your next booking</p>
            {REDEEM.map((r, i) => {
              const canRedeem = user.points >= r.pts
              const isRedeemed = redeemed.includes(i)
              return (
                <div key={i} className="flex justify-between items-center p-4 bg-white rounded-[14px] mb-2.5"
                  style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)', border: '1.5px solid #EDD8DE', opacity: !canRedeem && !isRedeemed ? 0.55 : 1 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[20px]"
                      style={{ background: '#F8E8EE' }}>{r.icon}</div>
                    <div>
                      <div className="font-dm font-semibold text-[14px] text-[#1A1012]">{r.label}</div>
                      <div className="font-dm text-[12px] text-[#A08088] mt-0.5">{r.pts.toLocaleString()} points</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(r.pts, i)}
                    disabled={!canRedeem || isRedeemed}
                    className="px-3.5 py-2 rounded-[10px] font-dm text-[12px] font-bold border-none cursor-pointer disabled:cursor-not-allowed transition-all"
                    style={{
                      background: isRedeemed ? '#4CAF50' : canRedeem ? 'linear-gradient(135deg,#B76E79,#D4AF7F)' : '#EDD8DE',
                      color: isRedeemed || canRedeem ? 'white' : '#A08088',
                    }}>
                    {isRedeemed ? '✓ Done' : canRedeem ? 'Redeem' : 'Need more'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Earn tab */}
        {tab === 'earn' && (
          <div>
            {EARN.map(e => (
              <div key={e.t} className="flex items-center gap-3.5 p-4 bg-white rounded-[14px] mb-2.5"
                style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
                <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[20px] flex-shrink-0"
                  style={{ background: '#F8E8EE' }}>{e.i}</div>
                <div className="flex-1">
                  <div className="font-dm font-semibold text-[14px] text-[#1A1012]">{e.t}</div>
                  <div className="font-dm text-[12px] font-semibold mt-0.5" style={{ color: '#B76E79' }}>{e.p}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div>
            {[
              { date: 'Jun 3', desc: 'Balayage at Lumière Studio', pts: +650, sign: '+' },
              { date: 'May 28', desc: 'Review left for Aurore Spa', pts: +50, sign: '+' },
              { date: 'May 20', desc: 'HydraFacial at Aurore Spa', pts: +840, sign: '+' },
              { date: 'May 15', desc: 'Points redeemed — ₹50 off', pts: -500, sign: '-' },
              { date: 'May 8', desc: 'Referred Sneha Malhotra', pts: +500, sign: '+' },
              { date: 'Apr 30', desc: 'Nail Art at Velvet & Gold', pts: +440, sign: '+' },
            ].map((h, i) => (
              <div key={i} className="flex justify-between items-center py-3.5 border-b border-[#EDD8DE]">
                <div>
                  <div className="font-dm text-[14px] font-medium text-[#1A1012]">{h.desc}</div>
                  <div className="font-dm text-[12px] text-[#A08088] mt-0.5">{h.date}</div>
                </div>
                <span className="font-cormorant font-bold text-[18px]"
                  style={{ color: h.sign === '+' ? '#4CAF50' : '#E57373' }}>
                  {h.sign}{Math.abs(h.pts)} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
