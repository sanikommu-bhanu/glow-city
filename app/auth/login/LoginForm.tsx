'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { signIn, signInWithGoogle } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/home'
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    formData.set('redirect', redirect)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
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
          <h1 className="font-cormorant font-light text-4xl md:text-5xl mt-6 text-luxury-black tracking-tight">
            Welcome Back
          </h1>
          <p className="font-dm text-sm mt-2 text-text-muted">Sign in to your beauty world</p>
        </div>

        <form action={handleSubmit} className="bg-white rounded-[24px] p-6 md:p-8 shadow-luxury border border-border/50 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-dm">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              name="email"
              placeholder="Email address"
              type="email"
              required
              className="w-full rounded-[14px] border border-border bg-cream/50 px-4 py-3.5 pl-10 font-dm text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              name="password"
              placeholder="Password"
              type={showPw ? 'text' : 'password'}
              required
              className="w-full rounded-[14px] border border-border bg-cream/50 px-4 py-3.5 pl-10 pr-11 font-dm text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Sign In
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="font-dm text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => signInWithGoogle()}
          >
            Continue with Google
          </Button>

          <p className="text-center font-dm text-sm text-text-muted">
            New to GlowCity?{' '}
            <Link href="/auth/signup" className="font-semibold text-rose-gold">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
