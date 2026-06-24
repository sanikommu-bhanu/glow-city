'use client'
import { useState } from 'react'
import BackHeader from '@/components/BackHeader'

const FAQS = [
  { q: 'How do I book an appointment?', a: 'Browse salons or services, tap "Book Now", pick your service, choose a date, time and stylist, then confirm payment. You\'ll get instant confirmation with a code to show at the salon.' },
  { q: 'Can I reschedule or cancel my booking?', a: 'Yes! You can reschedule or cancel free of charge up to 2 hours before your appointment time from the "My Bookings" section in your profile. After that, a small fee may apply.' },
  { q: 'How do Glow Points work?', a: 'You earn 200 points per ₹1,000 spent, plus 50 points for reviews and 500 points for each successful referral. Points can be redeemed for discounts — 500 points = ₹50 off. Reach 5,000 points for Platinum tier benefits.' },
  { q: 'Are the salons verified?', a: 'Every salon on GlowCity is manually verified by our quality team for hygiene standards, professional certifications, and customer service before being listed.' },
  { q: 'How does Glow AI work?', a: 'Glow AI analyzes your booking history, stated preferences, skin/hair type, and even local weather to recommend the best services and salons for you — completely free, with no paid AI subscriptions required.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), and GlowCity Wallet balance. All transactions are secured with bank-grade encryption.' },
  { q: 'Is my personal data safe?', a: 'Absolutely. We never sell your data to third parties. Location data is only used to show nearby salons and can be disabled anytime in Settings → Privacy.' },
  { q: 'Do you offer services outside Mumbai?', a: 'Currently we operate in 15 major Indian cities including Delhi, Bangalore, Pune, and Hyderabad. We\'re expanding to 10 more cities by end of 2026!' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)
  const [search, setSearch] = useState('')

  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Help & FAQ" backHref="/profile" />

      <div className="px-5 pb-10">
        <div className="flex items-center gap-2.5 bg-white rounded-[14px] px-4 py-3 mb-5" style={{ border: '1.5px solid #EDD8DE' }}>
          <span className="text-[16px] text-[#A08088]">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search help topics…"
            className="flex-1 bg-transparent font-dm text-[14px] text-[#1A1012] border-none outline-none" style={{ boxShadow: 'none' }} />
        </div>

        {filtered.length === 0 && (
          <p className="text-center font-dm text-[14px] text-[#A08088] py-8">No results found. Try a different search term.</p>
        )}

        {filtered.map((f, i) => (
          <div key={i} className="bg-white rounded-[14px] mb-2.5 overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.08)' }}>
            <div onClick={() => setOpen(open === i ? null : i)}
              className="flex justify-between items-center px-4 py-3.5 cursor-pointer">
              <span className="font-dm font-semibold text-[14px] text-[#1A1012] flex-1 pr-3">{f.q}</span>
              <span className="text-[18px] transition-transform" style={{ color: '#B76E79', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </div>
            {open === i && (
              <p className="font-dm text-[13px] text-[#6B4C52] leading-relaxed px-4 pb-4">{f.a}</p>
            )}
          </div>
        ))}

        <div className="mt-6 p-4 rounded-[16px] flex items-center gap-3" style={{ background: '#F8E8EE' }}>
          <span className="text-[28px]">💬</span>
          <div className="flex-1">
            <div className="font-dm font-semibold text-[14px] text-[#1A1012]">Still need help?</div>
            <div className="font-dm text-[12px] text-[#A08088] mt-0.5">Our support team replies within 2 hours</div>
          </div>
        </div>
      </div>
    </div>
  )
}
