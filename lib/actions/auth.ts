'use server'

import { redirect } from 'next/navigation'

export async function signUp(formData: FormData): Promise<{error?: string, redirect?: string}> {
  // Mock signup
  return { redirect: '/onboarding' }
}

export async function signIn(formData: FormData): Promise<{error?: string, redirect?: string}> {
  // Mock signin
  const redirectTo = (formData.get('redirect') as string) || '/home'
  return { redirect: redirectTo }
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
