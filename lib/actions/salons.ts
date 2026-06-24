'use server'

import { createClient } from '@/lib/supabase/server'
import { getDistanceKm } from '@/lib/utils'
import type { Salon } from '@/lib/types'

export interface SalonFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  openNow?: boolean
  city?: string
  search?: string
  lat?: number
  lng?: number
}

export async function getSalons(filters: SalonFilters = {}) {
  const supabase = await createClient()
  let query = supabase
    .from('salons')
    .select('*')
    .eq('status', 'approved')
    .order('rating', { ascending: false })

  if (filters.city) query = query.eq('city', filters.city)
  if (filters.minRating) query = query.gte('rating', filters.minRating)
  if (filters.minPrice) query = query.gte('price_range_min', filters.minPrice)
  if (filters.maxPrice) query = query.lte('price_range_max', filters.maxPrice)
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,area.ilike.%${filters.search}%,about.ilike.%${filters.search}%`)
  }
  if (filters.category && filters.category !== 'All') {
    query = query.contains('category', [filters.category])
  }

  const { data, error } = await query.limit(50)
  if (error) throw new Error(error.message)

  let salons = (data ?? []) as Salon[]

  if (filters.lat && filters.lng) {
    salons = salons
      .map((s) => ({
        ...s,
        distance_km:
          s.lat && s.lng
            ? getDistanceKm(filters.lat!, filters.lng!, s.lat, s.lng)
            : undefined,
      }))
      .sort((a, b) => (a.distance_km ?? 999) - (b.distance_km ?? 999))
  }

  if (filters.openNow) {
    const { isSalonOpenNow } = await import('@/lib/utils')
    salons = salons.filter((s) => isSalonOpenNow(s.hours ?? {}))
  }

  return salons
}

export async function getSalonBySlug(slug: string) {
  const supabase = await createClient()
  const { data: salon, error } = await supabase
    .from('salons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (error || !salon) return null

  const [services, stylists, reviews] = await Promise.all([
    supabase.from('services').select('*').eq('salon_id', salon.id).order('is_popular', { ascending: false }),
    supabase.from('stylists').select('*').eq('salon_id', salon.id),
    supabase.from('reviews').select('*').eq('salon_id', salon.id).order('created_at', { ascending: false }).limit(20),
  ])

  return {
    salon: salon as Salon,
    services: services.data ?? [],
    stylists: stylists.data ?? [],
    reviews: reviews.data ?? [],
  }
}

export async function getSalonById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('salons').select('slug').eq('id', id).single()
  if (!data?.slug) return null
  return getSalonBySlug(data.slug)
}

export async function getTrendingServices(city?: string) {
  const supabase = await createClient()
  let salonQuery = supabase.from('salons').select('id').eq('status', 'approved')
  if (city) salonQuery = salonQuery.eq('city', city)
  const { data: salonIds } = await salonQuery

  if (!salonIds?.length) return []

  const { data } = await supabase
    .from('services')
    .select('*, salon:salons(name, slug, area)')
    .in('salon_id', salonIds.map((s) => s.id))
    .eq('is_popular', true)
    .limit(8)

  return data ?? []
}
