export type UserRole = 'customer' | 'salon_owner' | 'admin'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type SalonStatus = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  city: string | null
  area: string | null
  avatar_url: string | null
  skin_type: string | null
  hair_type: string | null
  concerns: string[]
  preferences: Record<string, unknown>
  loyalty_points: number
  loyalty_tier: string
  onboarding_complete: boolean
  created_at: string
}

export interface Salon {
  id: string
  owner_id: string | null
  name: string
  slug: string
  tagline: string | null
  about: string | null
  category: string[]
  city: string
  area: string
  address: string | null
  lat: number | null
  lng: number | null
  phone: string | null
  email: string | null
  price_range_min: number
  price_range_max: number
  rating: number
  review_count: number
  verified: boolean
  cover_image_url: string | null
  gallery_urls: string[]
  amenities: string[]
  hours: Record<string, { open: string; close: string; closed?: boolean }>
  status: SalonStatus
  created_at: string
  distance_km?: number
}

export interface Service {
  id: string
  salon_id: string
  category: string
  name: string
  description: string | null
  duration_minutes: number
  price: number
  original_price: number | null
  image_url: string | null
  is_popular: boolean
}

export interface Stylist {
  id: string
  salon_id: string
  name: string
  role: string | null
  experience_years: number
  speciality: string | null
  rating: number
  image_url: string | null
  languages: string[]
}

export interface Booking {
  id: string
  customer_id: string
  salon_id: string
  service_id: string
  stylist_id: string | null
  booking_date: string
  booking_time: string
  status: BookingStatus
  price: number
  platform_fee: number
  loyalty_discount: number
  total_amount: number
  payment_status: string
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  points_earned: number
  notes: string | null
  created_at: string
  salon?: Salon
  service?: Service
  stylist?: Stylist
}

export interface Review {
  id: string
  booking_id: string
  customer_id: string
  salon_id: string
  rating: number
  comment: string | null
  created_at: string
  profile?: { full_name: string | null }
}

export interface LoyaltyTransaction {
  id: string
  customer_id: string
  type: 'earn' | 'redeem'
  points: number
  description: string | null
  booking_id: string | null
  created_at: string
}

export interface SalonRecommendation {
  salon: Salon
  matchPercent: number
  reason: string
  source: 'activity' | 'onboarding' | 'trending'
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  bookingCard?: {
    serviceId: string
    salonId: string
    serviceName: string
    salonName: string
    price: number
    imageUrl?: string
  }
  timestamp?: number
}

export const CATEGORIES = [
  { name: 'All', icon: 'Sparkles' },
  { name: 'Hair', icon: 'Scissors' },
  { name: 'Makeup', icon: 'Palette' },
  { name: 'Spa', icon: 'Flower2' },
  { name: 'Nails', icon: 'Gem' },
  { name: 'Skin', icon: 'Leaf' },
  { name: 'Bridal', icon: 'Crown' },
] as const

export const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'] as const
export const HAIR_TYPES = ['Straight', 'Wavy', 'Curly', 'Coily', 'Coloured'] as const
export const CONCERNS = [
  'Acne', 'Dryness', 'Frizz', 'Dandruff', 'Pigmentation',
  'Anti-aging', 'Hair fall', 'Dull skin', 'Split ends',
] as const

export const LOYALTY_TIERS = {
  silver: { min: 0, label: 'Silver', multiplier: 1 },
  gold: { min: 2000, label: 'Gold', multiplier: 1.5 },
  platinum: { min: 5000, label: 'Platinum', multiplier: 2 },
} as const

export function formatPrice(paise: number): string {
  return `₹${paise.toLocaleString('en-IN')}`
}

export function getLoyaltyTier(points: number): keyof typeof LOYALTY_TIERS {
  if (points >= LOYALTY_TIERS.platinum.min) return 'platinum'
  if (points >= LOYALTY_TIERS.gold.min) return 'gold'
  return 'silver'
}

export function computeTierProgress(points: number) {
  const tier = getLoyaltyTier(points)
  const nextTier =
    tier === 'silver' ? 'gold' : tier === 'gold' ? 'platinum' : null
  if (!nextTier) return { tier, progress: 100, nextTier: null, pointsToNext: 0 }
  const currentMin = LOYALTY_TIERS[tier].min
  const nextMin = LOYALTY_TIERS[nextTier].min
  const progress = Math.min(100, ((points - currentMin) / (nextMin - currentMin)) * 100)
  return { tier, progress, nextTier, pointsToNext: nextMin - points }
}
