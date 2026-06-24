'use client'
import { useState } from 'react'
import { NOTIFICATIONS } from '@/lib/data'
import BackHeader from '@/components/BackHeader'

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, unread: false })))
  const markRead = (id: number) => setNotifs(n => n.map(x => x.id === id ? { ...x, unread: false } : x))

  const typeColors: Record<string, string> = {
    booking: '#B76E79', reward: '#D4AF7F', offer: '#4CAF50', new: '#2196F3', social: '#9C27B0',
  }

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader
        title="Notifications"
        backHref="/home"
        right={
          <button onClick={markAll} className="font-dm text-[12px] font-medium border-none bg-transparent cursor-pointer" style={{ color: '#B76E79' }}>
            Mark all read
          </button>
        }
      />

      <div className="px-5 py-2">
        <div className="flex gap-2 mb-4">
          {['All', 'Bookings', 'Rewards', 'Offers'].map(f => (
            <button key={f} className="font-dm text-[12px] px-3 py-1.5 rounded-full border-none cursor-pointer"
              style={{ background: f === 'All' ? 'linear-gradient(135deg,#B76E79,#D4AF7F)' : 'white', color: f === 'All' ? 'white' : '#6B4C52', border: '1.5px solid #EDD8DE' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {notifs.map(n => (
        <div key={n.id} onClick={() => markRead(n.id)}
          className="flex gap-3.5 px-5 py-4 cursor-pointer transition-colors hover:bg-[rgba(183,110,121,0.02)]"
          style={{ background: n.unread ? 'rgba(183,110,121,0.04)' : 'white', borderBottom: '1px solid #EDD8DE' }}>
          <div className="w-11 h-11 rounded-[13px] flex items-center justify-center text-[20px] flex-shrink-0"
            style={{ background: '#F8E8EE' }}>{n.icon}</div>
          <div className="flex-1">
            <div className="flex justify-between items-start gap-2">
              <div className="font-dm text-[14px] font-semibold text-[#1A1012]" style={{ fontWeight: n.unread ? 700 : 500 }}>{n.title}</div>
              {n.unread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: typeColors[n.type] || '#B76E79' }} />}
            </div>
            <div className="font-dm text-[13px] text-[#A08088] mt-0.5">{n.body}</div>
            <div className="font-dm text-[11px] text-[#C0A0A8] mt-1">{n.time}</div>
          </div>
        </div>
      ))}

      {notifs.every(n => !n.unread) && (
        <div className="text-center py-8">
          <div className="text-[32px] mb-2">✅</div>
          <p className="font-dm text-[13px] text-[#A08088]">All caught up!</p>
        </div>
      )}
    </div>
  )
}
