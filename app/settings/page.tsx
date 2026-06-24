'use client'
import { useState } from 'react'
import { useStore } from '@/store/useStore'
import BackHeader from '@/components/BackHeader'
import Toggle from '@/components/Toggle'

export default function SettingsPage() {
  const { user, updateUser } = useStore()
  const [editName, setEditName] = useState(false)
  const [name, setName] = useState(user.name)

  const groups = [
    {
      label: 'Notifications',
      items: [
        { k: 'push', l: 'Push Notifications', i: '🔔', def: true },
        { k: 'email', l: 'Email Updates', i: '📧', def: false },
        { k: 'sms', l: 'SMS Reminders', i: '💬', def: true },
        { k: 'offers', l: 'Promotional Offers', i: '🎁', def: true },
      ],
    },
    {
      label: 'Privacy',
      items: [
        { k: 'location', l: 'Location Services', i: '📍', def: true },
        { k: 'analytics', l: 'Share Analytics', i: '📊', def: false },
        { k: 'personalised', l: 'Personalised Ads', i: '🎯', def: false },
      ],
    },
    {
      label: 'App',
      items: [
        { k: 'ai', l: 'Glow AI Recommendations', i: '✨', def: true },
        { k: 'darkmode', l: 'Dark Mode', i: '🌙', def: false },
        { k: 'haptics', l: 'Haptic Feedback', i: '📳', def: true },
      ],
    },
  ]

  const links = [
    { l: 'Change Password', i: '🔒' },
    { l: 'Linked Accounts', i: '🔗' },
    { l: 'Manage Payment Methods', i: '💳' },
    { l: 'Privacy Policy', i: '📄' },
    { l: 'Terms of Service', i: '📃' },
    { l: 'Delete Account', i: '🗑️', danger: true },
  ]

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Settings" backHref="/profile" />

      <div className="px-5 pb-10">
        {/* Profile edit */}
        <div className="bg-white rounded-[18px] p-4 mb-5" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
          <p className="font-dm text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08088] mb-3">Profile</p>
          {editName ? (
            <div className="flex gap-2">
              <input value={name} onChange={e => setName(e.target.value)}
                className="flex-1 rounded-[12px] border border-[#EDD8DE] bg-white px-3 py-2.5 font-dm text-[14px]" />
              <button onClick={() => { updateUser({ name }); setEditName(false) }}
                className="px-4 py-2.5 rounded-[12px] font-dm text-[13px] font-semibold text-white border-none cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>Save</button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-dm font-semibold text-[15px] text-[#1A1012]">{user.name}</div>
                <div className="font-dm text-[12px] text-[#A08088] mt-0.5">{user.email}</div>
              </div>
              <button onClick={() => setEditName(true)}
                className="font-dm text-[13px] font-medium px-3 py-1.5 rounded-full border-none cursor-pointer"
                style={{ background: '#F8E8EE', color: '#B76E79' }}>Edit</button>
            </div>
          )}
        </div>

        {/* Toggle groups */}
        {groups.map(g => (
          <div key={g.label} className="mb-4">
            <p className="font-dm text-[10px] font-bold uppercase tracking-[0.12em] text-[#A08088] mb-2 pl-1">{g.label}</p>
            <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
              {g.items.map((item, idx) => (
                <div key={item.k} className={`flex items-center justify-between px-4 py-3.5 ${idx < g.items.length - 1 ? 'border-b border-[#EDD8DE]' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-[19px]">{item.i}</span>
                    <span className="font-dm text-[14px] font-medium text-[#1A1012]">{item.l}</span>
                  </div>
                  <Toggle defaultOn={item.def} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Link items */}
        <div className="mb-4">
          <p className="font-dm text-[10px] font-bold uppercase tracking-[0.12em] text-[#A08088] mb-2 pl-1">More Options</p>
          <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
            {links.map((item, idx) => (
              <div key={item.l} className={`flex items-center px-4 py-3.5 cursor-pointer hover:bg-[rgba(183,110,121,0.02)] ${idx < links.length - 1 ? 'border-b border-[#EDD8DE]' : ''}`}>
                <span className="text-[19px] w-7 mr-3 text-center">{item.i}</span>
                <span className={`flex-1 font-dm text-[14px] font-medium ${(item as any).danger ? 'text-red-500' : 'text-[#1A1012]'}`}>{item.l}</span>
                <span className="text-[#A08088] text-[18px]">›</span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-dm text-[11px] text-center text-[#A08088]">GlowCity AI v1.0.0 · © 2025 GlowCity Technologies Pvt. Ltd.</p>
      </div>
    </div>
  )
}
