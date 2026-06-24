'use client'
import { useState } from 'react'
import BackHeader from '@/components/BackHeader'

export default function ContactPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const channels = [
    { i: '📞', t: 'Call Us', s: 'Mon–Sat, 9 AM – 8 PM', a: '1800-209-3456' },
    { i: '📧', t: 'Email Support', s: 'Reply within 2 hours', a: 'hello@glowcity.in' },
    { i: '💬', t: 'Live Chat', s: 'Available 24/7', a: 'Chat with Glow AI' },
    { i: '📍', t: 'Headquarters', s: 'Mumbai, Maharashtra', a: 'BKC, Mumbai 400051' },
  ]

  const handleSend = () => {
    if (!message.trim()) return
    setSent(true)
    setTimeout(() => { setSent(false); setSubject(''); setMessage('') }, 2500)
  }

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Contact Us" backHref="/profile" />

      <div className="px-5 pb-10">
        {channels.map(c => (
          <div key={c.t} className="flex items-center gap-3.5 p-4 bg-white rounded-[16px] mb-2.5" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[24px]" style={{ background: '#F8E8EE' }}>{c.i}</div>
            <div className="flex-1">
              <div className="font-dm font-semibold text-[14px] text-[#1A1012]">{c.t}</div>
              <div className="font-dm text-[12px] text-[#A08088] mt-0.5">{c.s}</div>
            </div>
            <span className="font-dm font-bold text-[12px] text-right" style={{ color: '#B76E79', maxWidth: 110 }}>{c.a}</span>
          </div>
        ))}

        <div className="mt-6">
          <h3 className="font-cormorant font-semibold text-[#1A1012] mb-3" style={{ fontSize: 22 }}>Send us a message</h3>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            placeholder="Subject" className="w-full rounded-[14px] border border-[#EDD8DE] bg-white px-4 py-3.5 font-dm text-[14px] text-[#1A1012] mb-3" />
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Your message…" rows={5}
            className="w-full rounded-[14px] border border-[#EDD8DE] bg-white px-4 py-3.5 font-dm text-[14px] text-[#1A1012] resize-none mb-4" />
          <button onClick={handleSend} disabled={!message.trim()}
            className="w-full h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}>
            {sent ? '✓ Message Sent!' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  )
}
