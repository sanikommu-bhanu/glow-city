'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createEmbedding, buildProfileEmbeddingText } from '@/lib/ai/client'
import type { Salon, SalonRecommendation } from '@/lib/types'

export async function getRecommendations(
  profileEmbedding?: number[] | null
): Promise<SalonRecommendation[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('*').eq('id', user.id).single()
    : { data: null }

  const city = profile?.city ?? 'Mumbai'

  // Get past booking categories for activity-based recommendations
  let pastCategories: string[] = []
  if (user) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('service:services(category)')
      .eq('customer_id', user.id)
      .eq('status', 'completed')
      .limit(10)

    pastCategories = (bookings ?? [])
      .map((b) => (b.service as { category?: string })?.category)
      .filter(Boolean) as string[]
  }

  const hasActivity = pastCategories.length > 0
  const source: SalonRecommendation['source'] = hasActivity ? 'activity' : 'onboarding'

  // Try pgvector match if we have embedding capability
  if (process.env.OPENROUTER_API_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      let embedding = profileEmbedding
      if (!embedding && profile) {
        const profileText = buildProfileEmbeddingText({
          skin_type: profile.skin_type,
          hair_type: profile.hair_type,
          concerns: profile.concerns,
          preferences: profile.preferences,
          city: profile.city,
          pastCategories,
        })
        embedding = await createEmbedding(profileText)
      }

      if (embedding) {
        const serviceClient = await createServiceClient()
        const { data: matches } = await serviceClient.rpc('match_salons', {
          query_embedding: embedding,
          match_city: city,
          match_count: 6,
        })

        if (matches?.length) {
          const salonIds = matches.map((m: { salon_id: string }) => m.salon_id)
          const { data: salons } = await supabase
            .from('salons')
            .select('*')
            .in('id', salonIds)
            .eq('status', 'approved')

          const salonMap = new Map((salons as Salon[]).map((s) => [s.id, s]))

          return matches
            .map((m: { salon_id: string; similarity: number }) => {
              const salon = salonMap.get(m.salon_id)
              if (!salon) return null
              const matchPercent = Math.round(m.similarity * 100)
              const reason = buildReason(profile, pastCategories, salon, source)
              return { salon, matchPercent, reason, source }
            })
            .filter(Boolean) as SalonRecommendation[]
        }
      }
    } catch {
      // Fall through to rule-based recommendations
    }
  }

  // Fallback: preference-based sorting without embeddings
  const { data: salons } = await supabase
    .from('salons')
    .select('*')
    .eq('status', 'approved')
    .eq('city', city)
    .order('rating', { ascending: false })
    .limit(6)

  const favCategories = (profile?.preferences as { favorite_categories?: string[] })?.favorite_categories ?? []

  return ((salons as Salon[]) ?? []).map((salon, i) => {
    let score = 70 + Math.round(salon.rating * 5)
    if (favCategories.some((c) => salon.category.includes(c))) score += 15
    if (profile?.skin_type && salon.about?.toLowerCase().includes(profile.skin_type.toLowerCase())) score += 10
    if (pastCategories.some((c) => salon.category.includes(c))) score += 12

    return {
      salon,
      matchPercent: Math.min(98, score - i * 2),
      reason: buildReason(profile, pastCategories, salon, source),
      source,
    }
  })
}

function buildReason(
  profile: { skin_type?: string | null; hair_type?: string | null; concerns?: string[] | null } | null,
  pastCategories: string[],
  salon: Salon,
  source: SalonRecommendation['source']
): string {
  const parts: string[] = []

  if (source === 'activity' && pastCategories.length) {
    const match = pastCategories.find((c) => salon.category.includes(c))
    if (match) parts.push(`you loved ${match} services before`)
  }

  if (profile?.skin_type) parts.push(`${profile.skin_type.toLowerCase()} skin`)
  if (profile?.hair_type) parts.push(`${profile.hair_type.toLowerCase()} hair`)
  if (profile?.concerns?.length) {
    const concern = profile.concerns.find((c) =>
      salon.about?.toLowerCase().includes(c.toLowerCase()) ||
      salon.category.some((cat) => cat.toLowerCase().includes(c.toLowerCase()))
    )
    if (concern) parts.push(`${concern.toLowerCase()} care`)
  }

  if (parts.length === 0) {
    return source === 'onboarding'
      ? 'Based on what you told us during onboarding'
      : `Top-rated ${salon.category[0] ?? 'beauty'} in ${salon.area}`
  }

  const prefix = source === 'onboarding' ? 'Based on what you told us: ' : 'Recommended because: '
  return prefix + parts.slice(0, 2).join(' + ')
}

export async function generateSalonEmbedding(salonId: string) {
  if (!process.env.OPENROUTER_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Missing API keys' }
  }

  const serviceClient = await createServiceClient()
  const { data: salon } = await serviceClient.from('salons').select('*').eq('id', salonId).single()
  if (!salon) return { error: 'Salon not found' }

  const { data: services } = await serviceClient.from('services').select('name, category').eq('salon_id', salonId)

  const { buildSalonEmbeddingText } = await import('@/lib/ai/client')
  const text = buildSalonEmbeddingText({ ...salon, services: services ?? [] })
  const embedding = await createEmbedding(text)

  await serviceClient.from('salon_embeddings').upsert({
    salon_id: salonId,
    embedding,
    updated_at: new Date().toISOString(),
  })

  return { success: true }
}
