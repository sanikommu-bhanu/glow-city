'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => router.replace('/home'), 2200)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-luxury-black">
      <div
        className="absolute rounded-full w-80 h-80 animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(183,110,121,0.35), transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }}
      />

      <div className="text-center animate-scale-in relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-champagne animate-float" />
        </div>
        <div className="font-cormorant text-white leading-none text-5xl md:text-6xl font-light tracking-tight">
          Glow<span className="text-rose-gold">City</span>
          <sup className="font-dm font-bold text-lg text-champagne align-super ml-1">AI</sup>
        </div>
        <div className="relative overflow-hidden mx-auto my-6 h-px w-48 bg-gradient-to-r from-transparent via-champagne to-transparent" />
        <div className="font-dm text-[11px] tracking-[0.18em] uppercase text-text-muted animate-fade-up">
          Beauty, Redefined by Intelligence
        </div>
      </div>

      <div className="absolute bottom-8 left-10 right-10 max-w-xs mx-auto h-0.5 rounded-full overflow-hidden bg-white/10">
        <div className="h-full rounded-full loading-bar bg-gradient-gold" />
      </div>
    </div>
  )
}
