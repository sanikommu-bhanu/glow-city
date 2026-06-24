'use client'
import BackHeader from '@/components/BackHeader'

export default function AboutPage() {
  const stats = [
    { v: '500+', l: 'Partner Salons' },
    { v: '52K+', l: 'Happy Clients' },
    { v: '15', l: 'Cities' },
    { v: '4.9★', l: 'App Rating' },
  ]

  const team = [
    { name: 'Ananya Rao', role: 'Founder & CEO', emoji: '👩‍💼' },
    { name: 'Vikram Singh', role: 'Head of Engineering', emoji: '👨‍💻' },
    { name: 'Meera Joshi', role: 'Head of Partnerships', emoji: '🤝' },
  ]

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="About GlowCity" backHref="/profile" />

      <div className="text-center pt-6 pb-7 px-6">
        <div className="font-cormorant font-semibold" style={{ fontSize: 34, color: '#1A1012' }}>
          Glow<span style={{ color: '#B76E79' }}>City</span>{' '}
          <span className="font-dm font-bold" style={{ fontSize: 18, color: '#D4AF7F' }}>AI</span>
        </div>
        <div className="font-dm text-[12px] tracking-[0.14em] uppercase text-[#A08088] mt-2">Version 1.0.0</div>
      </div>

      <div className="px-5 pb-10">
        <p className="font-dm text-[14px] text-[#6B4C52] leading-[1.8] mb-6">
          GlowCity AI is India's first AI-powered luxury beauty marketplace, connecting discerning clients
          with the country's top salons, spas, and beauty professionals. Founded in 2022, we've grown to
          serve over 52,000 customers across 15 cities — powered by genuinely personalized AI recommendations,
          not generic search results.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map(s => (
            <div key={s.l} className="bg-white rounded-[16px] p-4 text-center" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
              <div className="font-cormorant font-bold text-[28px]" style={{ color: '#B76E79' }}>{s.v}</div>
              <div className="font-dm text-[12px] text-[#A08088] mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-cormorant font-semibold text-[#1A1012] mb-3" style={{ fontSize: 22 }}>Our Mission</h3>
          <p className="font-dm text-[14px] text-[#6B4C52] leading-[1.75]">
            We believe beauty services should be effortless to discover and book. Our AI assistant, Glow,
            learns your preferences over time — your skin type, budget, favorite stylists — and surfaces
            recommendations that actually fit your life. No more endless scrolling through reviews.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-cormorant font-semibold text-[#1A1012] mb-3" style={{ fontSize: 22 }}>Leadership</h3>
          {team.map(t => (
            <div key={t.name} className="flex items-center gap-3.5 bg-white rounded-[14px] p-3.5 mb-2.5" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[24px]" style={{ background: '#F8E8EE' }}>{t.emoji}</div>
              <div>
                <div className="font-dm font-semibold text-[15px] text-[#1A1012]">{t.name}</div>
                <div className="font-dm text-[12px] text-[#A08088] mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-cormorant font-semibold text-[#1A1012] mb-3" style={{ fontSize: 22 }}>Technology</h3>
          <div className="flex flex-wrap gap-2">
            {['Next.js 14', 'AI Recommendations', 'Real-time Weather Integration', 'OpenStreetMap', 'Open Beauty Facts'].map(t => (
              <span key={t} className="font-dm text-[12px] px-3 py-1.5 rounded-full" style={{ border: '1.5px solid #EDD8DE', background: 'white', color: '#6B4C52' }}>{t}</span>
            ))}
          </div>
        </div>

        <p className="font-dm text-[12px] text-center text-[#A08088]">© 2025 GlowCity Technologies Pvt. Ltd.<br/>Made with ❤️ in Mumbai</p>
      </div>
    </div>
  )
}
