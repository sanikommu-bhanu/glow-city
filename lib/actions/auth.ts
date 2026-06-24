'use server'

import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  // Mock signup
  redirect('/onboarding')
}

export async function signIn(formData: FormData) {
  // Mock signin
  const redirectTo = (formData.get('redirect') as string) || '/home'
  redirect(redirectTo)
}

export async function signOut() {
  // Mock signout
  redirect('/auth/login')
}

export async function signInWithGoogle() {
  // Mock Google signin
  redirect('/home')
}

export async function getSession() {
  // Mock session for UI
  return { id: 'mock-user-1', email: 'user@example.com', user_metadata: { full_name: 'Guest User' } }
}
