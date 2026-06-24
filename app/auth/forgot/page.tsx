'use client'
import { useState } from 'react'
import Link from 'next/link'
import BackHeader from '@/components/BackHeader'

export default function ForgotPage() {
  const [sent, setSent] = useState(false)
  return (
    <div className="h-full overflow-y-auto no-scroll" style={{ background: 'linear-gradient(155deg,#FDF8F5,#F8E8EE)' }}>
      <BackHeader title="" backHref="/auth/login" />

      <div className="px-6 text-center pt-4">
        <div
          className="w-[70px] h-[70px] rounded-[22px] flex items-center justify-center text-[30px] mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.3)' }}
        >
          🔒
        </div>
        <h2 className="font-cormorant font-light tracking-tight mb-3" style={{ fontSize: 36, color: '#1A1012' }}>
          Reset Password
        </h2>
        <p className="font-dm text-[14px] leading-relaxed mb-7" style={{ color: '#A08088' }}>
          Enter your email and we'll send you a secure reset link.
        </p>
      </div>

      <div className="px-6">
        {!sent ? (
          <div className="flex flex-col gap-4">
            <input
              placeholder="Email address" type="email"
              className="w-full rounded-[14px] border border-[#EDD8DE] bg-white px-4 py-3.5 font-dm text-[15px] text-[#1A1012]"
            />
            <button
              onClick={() => setSent(true)}
              className="w-full h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white"
              style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}
            >
              Send Reset Link
            </button>
            <p className="text-center font-dm text-[14px]">
              <Link href="/auth/login" className="font-medium" style={{ color: '#B76E79' }}>← Back to Login</Link>
            </p>
          </div>
        ) : (
          <div className="text-center" style={{ animation: 'scale-in 0.5s ease-out' }}>
            <div className="text-[52px] mb-4">✅</div>
            <h3 className="font-cormorant font-semibold text-[26px] text-[#1A1012]">Check your inbox!</h3>
            <p className="font-dm text-[14px] text-[#A08088] mt-2 mb-8">Reset link sent to your email address.</p>
            <Link href="/auth/login">
              <button
                className="w-full h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white"
                style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}
              >
                Back to Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
