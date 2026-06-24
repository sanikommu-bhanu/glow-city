'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function completeOnboarding(formData: FormData) {
  // If no Supabase URL is set, bypass the database logic so the UI can still be tested
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("No Supabase URL configured. Bypassing database update and mocking onboarding success.");
    redirect('/home');
  }

  let errorMsg = null;

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const concerns = formData.getAll('concerns') as string[]
    const preferences = {
      favorite_categories: formData.getAll('categories') as string[],
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        city: formData.get('city') as string,
        area: formData.get('area') as string,
        skin_type: formData.get('skinType') as string,
        hair_type: formData.get('hairType') as string,
        concerns,
        preferences,
        onboarding_complete: true,
      })
      .eq('id', user.id)

    if (error) {
      errorMsg = error.message;
    }
  } catch (err: any) {
    console.error("completeOnboarding exception:", err);
    errorMsg = err.message || "Unknown error occurred";
  }

  if (errorMsg) return { error: errorMsg };

  revalidatePath('/home')
  redirect('/home')
}

export async function updateProfile(updates: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { success: true }
}
