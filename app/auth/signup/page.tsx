'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User } from 'lucide-react'
import { signUp } from '@/lib/actions/auth'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/Button'

export default function SignUpPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { updateUser } = useStore()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.redirect) {
      updateUser({
        name: formData.get('fullName') as string,
        email: formData.get('email') as string,
      })
      router.push(result.redirect)
    }
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-cormorant text-3xl font-medium text-luxury-black">
            Glow<span className="text-rose-gold">City</span>
            <span className="font-dm font-bold text-xs text-champagne ml-0.5">AI</span>
          </div>
          <h1 className="font-cormorant font-light text-4xl mt-6 text-luxury-black">Join GlowCity</h1>
          <p className="font-dm text-sm mt-2 text-text-muted">Your AI-powered beauty journey starts here</p>
        </div>

        <form action={handleSubmit} className="bg-white rounded-[24px] p-6 md:p-8 shadow-luxury border border-border/50 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-dm">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input name="fullName" placeholder="Full name" required className="w-full rounded-[14px] border border-border bg-cream/50 px-4 py-3.5 pl-10 font-dm text-sm" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input name="email" placeholder="Email address" type="email" required className="w-full rounded-[14px] border border-border bg-cream/50 px-4 py-3.5 pl-10 font-dm text-sm" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input name="password" placeholder="Password (min 6 chars)" type="password" required minLength={6} className="w-full rounded-[14px] border border-border bg-cream/50 px-4 py-3.5 pl-10 font-dm text-sm" />
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create Account
          </Button>

          <p className="text-center font-dm text-sm text-text-muted">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-rose-gold">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
