'use client'
import { useState, useTransition } from 'react'
import { MapPin, Sparkles, Check } from 'lucide-react'
import { completeOnboarding } from '@/lib/actions/profile'
import { Button } from '@/components/ui/Button'
import { SKIN_TYPES, HAIR_TYPES, CONCERNS, CATEGORIES } from '@/lib/types'
import { cn } from '@/lib/cn'

const MUMBAI_AREAS = [
  'Bandra West', 'Juhu', 'Worli', 'Colaba', 'Powai', 'Andheri West',
  'Khar', 'Lower Parel', 'Bandra East', 'Versova',
]

const STEPS = ['Location', 'Skin & Hair', 'Preferences']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [city] = useState('Mumbai')
  const [area, setArea] = useState('')
  const [skinType, setSkinType] = useState('')
  const [hairType, setHairType] = useState('')
  const [concerns, setConcerns] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  function handleComplete() {
    startTransition(async () => {
      setError('')
      const fd = new FormData()
      fd.set('city', city)
      fd.set('area', area)
      fd.set('skinType', skinType)
      fd.set('hairType', hairType)
      concerns.forEach((c) => fd.append('concerns', c))
      categories.forEach((c) => fd.append('categories', c))
      const result = await completeOnboarding(fd)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  const canNext =
    step === 0 ? !!area :
    step === 1 ? !!skinType && !!hairType :
    categories.length > 0

  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      <div className="max-w-lg mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="font-cormorant text-2xl text-luxury-black">
            Glow<span className="text-rose-gold">City</span>
          </div>
          <p className="font-dm text-sm text-text-muted mt-2">3 quick taps to personalize your experience</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={cn('h-1 rounded-full transition-all', i <= step ? 'bg-gradient-gold' : 'bg-border')} />
              <span className="font-dm text-[10px] text-text-muted mt-1 block">{s}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-[24px] p-6 shadow-luxury border border-border/50">
          {error && <p className="text-red-600 text-sm mb-4 font-dm">{error}</p>}

          {step === 0 && (
            <div className="animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-rose-gold" />
                <h2 className="font-cormorant text-2xl font-semibold">Where are you?</h2>
              </div>
              <p className="font-dm text-sm text-text-muted mb-4">We will show salons near you in {city}</p>
              <div className="grid grid-cols-2 gap-2">
                {MUMBAI_AREAS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setArea(a)}
                    className={cn(
                      'px-3 py-3 rounded-xl border text-sm font-dm font-medium transition-all text-left',
                      area === a ? 'border-rose-gold bg-rose-gold/8 text-rose-gold' : 'border-border hover:border-rose-gold/40'
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-cormorant text-2xl font-semibold mb-4">Your skin & hair</h2>
              <p className="font-dm text-xs text-text-muted mb-3 uppercase tracking-wide">Skin type</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {SKIN_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => setSkinType(t)}
                    className={cn('px-4 py-2 rounded-full border text-sm font-dm', skinType === t ? 'pill-active' : 'border-border')}
                  >{t}</button>
                ))}
              </div>
              <p className="font-dm text-xs text-text-muted mb-3 uppercase tracking-wide">Hair type</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {HAIR_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => setHairType(t)}
                    className={cn('px-4 py-2 rounded-full border text-sm font-dm', hairType === t ? 'pill-active' : 'border-border')}
                  >{t}</button>
                ))}
              </div>
              <p className="font-dm text-xs text-text-muted mb-3 uppercase tracking-wide">Concerns (optional)</p>
              <div className="flex flex-wrap gap-2">
                {CONCERNS.slice(0, 6).map((c) => (
                  <button key={c} type="button" onClick={() => toggle(concerns, c, setConcerns)}
                    className={cn('px-3 py-1.5 rounded-full border text-xs font-dm', concerns.includes(c) ? 'pill-active' : 'border-border')}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-champagne" />
                <h2 className="font-cormorant text-2xl font-semibold">What do you love?</h2>
              </div>
              <p className="font-dm text-sm text-text-muted mb-4">Powers your AI recommendations</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.filter((c) => c.name !== 'All').map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggle(categories, c.name, setCategories)}
                    className={cn(
                      'px-4 py-4 rounded-xl border text-sm font-dm font-medium flex items-center justify-between',
                      categories.includes(c.name) ? 'border-rose-gold bg-rose-gold/8 text-rose-gold' : 'border-border'
                    )}
                  >
                    {c.name}
                    {categories.includes(c.name) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <Button variant="secondary" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 2 ? (
            <Button className="flex-1" disabled={!canNext} onClick={() => setStep(step + 1)}>
              Continue
            </Button>
          ) : (
            <Button className="flex-1" disabled={!canNext} loading={isPending} onClick={handleComplete}>
              Start Exploring
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
