import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-gradient flex items-center justify-center font-dm text-text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
