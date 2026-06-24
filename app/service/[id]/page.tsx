'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SERVICES, IMG } from '@/lib/data'

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const service = SERVICES.find(s => s.id === Number(params.id)) || SERVICES[1]

  const included = [
    'Consultation with master specialist',
    'Olaplex bond treatment (hair services)',
    'Full treatment application & processing',
    'Blow dry & styling finish',
    'Aftercare product recommendations',
  ]

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <div className="relative h-[210px] overflow-hidden">
        <img src={IMG('photo-1522337360788-8b13dee7a37e')} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,16,18,0.6)] to-transparent" />
        <button
          onClick={() => router.back()}
          className="absolute top-3.5 left-4 w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[18px] text-[#1A1012]"
          style={{ boxShadow: '0 4px 16px rgba(183,110,121,0.14)' }}
        >←</button>
      </div>

      <div className="px-5 pt-5 pb-28">
        <div className="font-dm text-[10px] tracking-[0.12em] uppercase text-[#A08088] mb-2">
          {service.category} · Service
        </div>
        <h2 className="font-cormorant font-semibold text-[#1A1012] tracking-tight mb-3" style={{ fontSize: 32 }}>{service.name}</h2>

        <div className="flex gap-4 mb-5">
          <span className="font-dm text-[13px] text-[#6B4C52]">⏱ {service.duration}</span>
          <span className="font-dm text-[13px] text-[#6B4C52]">👁 2.4k views</span>
          <span className="font-dm text-[13px]" style={{ color: '#D4AF7F' }}>★ 4.9</span>
        </div>

        <p className="font-dm text-[14px] text-[#6B4C52] leading-[1.75] mb-5">{service.description}</p>

        <div className="rounded-[16px] p-4 mb-5" style={{ background: '#F8E8EE' }}>
          <div className="font-dm text-[12px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: '#B76E79' }}>What's Included</div>
          {included.map(item => (
            <div key={item} className="flex gap-2.5 mb-2 items-start">
              <span className="font-dm text-[13px] mt-0.5" style={{ color: '#B76E79' }}>✓</span>
              <span className="font-dm text-[13px] text-[#6B4C52]">{item}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center p-4 bg-white rounded-[16px]" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.12)' }}>
          <div>
            <div className="font-dm text-[11px] uppercase tracking-[0.08em] text-[#A08088]">Starting from</div>
            <div className="font-cormorant font-bold" style={{ fontSize: 30, color: '#B76E79' }}>₹{service.price.toLocaleString()}</div>
          </div>
          <Link href="/booking/1">
            <button
              className="px-7 h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white"
              style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}
            >
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
