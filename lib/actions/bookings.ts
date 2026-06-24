'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { parseDisplayTimeToDb, canCancelBooking } from '@/lib/utils'
import { getLoyaltyTier, LOYALTY_TIERS } from '@/lib/types'

const PLATFORM_FEE_PERCENT = 5
const POINTS_PER_100_RUPEES = 10

export async function getBookedSlots(stylistId: string, date: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('bookings')
    .select('booking_time')
    .eq('stylist_id', stylistId)
    .eq('booking_date', date)
    .in('status', ['pending', 'confirmed'])

  return (data ?? []).map((b) => b.booking_time)
}

export async function createBooking(input: {
  salonId: string
  serviceId: string
  stylistId: string
  date: string
  time: string
  notes?: string
  loyaltyPointsToRedeem?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Please sign in to book' }

  const { data: service } = await supabase
    .from('services')
    .select('*, salon:salons(name)')
    .eq('id', input.serviceId)
    .single()

  if (!service) return { error: 'Service not found' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('loyalty_points, loyalty_tier')
    .eq('id', user.id)
    .single()

  const price = service.price
  const platformFee = Math.round(price * PLATFORM_FEE_PERCENT / 100)
  const maxRedeem = Math.min(profile?.loyalty_points ?? 0, Math.floor(price * 0.2))
  const loyaltyDiscount = Math.min(input.loyaltyPointsToRedeem ?? 0, maxRedeem)
  const totalAmount = price + platformFee - loyaltyDiscount

  const bookingTime = parseDisplayTimeToDb(input.time)

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: user.id,
      salon_id: input.salonId,
      service_id: input.serviceId,
      stylist_id: input.stylistId,
      booking_date: input.date,
      booking_time: bookingTime,
      status: 'pending',
      price,
      platform_fee: platformFee,
      loyalty_discount: loyaltyDiscount,
      total_amount: totalAmount,
      payment_status: 'pending',
      notes: input.notes,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'This time slot was just booked. Please pick another.' }
    return { error: error.message }
  }

  return { booking }
}

export async function getUserBookings(status?: 'upcoming' | 'past') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('bookings')
    .select('*, salon:salons(name, slug, area, cover_image_url), service:services(name, duration_minutes), stylist:stylists(name)')
    .eq('customer_id', user.id)
    .order('booking_date', { ascending: false })

  const { data } = await query
  const today = new Date().toISOString().split('T')[0]

  if (status === 'upcoming') {
    return (data ?? []).filter(
      (b) => b.status !== 'cancelled' && b.status !== 'completed' && b.booking_date >= today
    )
  }
  if (status === 'past') {
    return (data ?? []).filter(
      (b) => b.status === 'completed' || b.status === 'cancelled' || b.booking_date < today
    )
  }
  return data ?? []
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('customer_id', user.id)
    .single()

  if (!booking) return { error: 'Booking not found' }
  if (!canCancelBooking(booking.booking_date, booking.booking_time)) {
    return { error: 'Free cancellation is only available up to 2 hours before your appointment.' }
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { success: true }
}

export async function confirmPayment(bookingId: string, razorpayPaymentId: string, razorpayOrderId: string) {
  const serviceClient = await createServiceClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: booking } = await serviceClient
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('customer_id', user.id)
    .single()

  if (!booking) return { error: 'Booking not found' }

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('loyalty_points, loyalty_tier')
    .eq('id', user.id)
    .single()

  const tier = getLoyaltyTier(profile?.loyalty_points ?? 0)
  const multiplier = LOYALTY_TIERS[tier].multiplier
  const basePoints = Math.floor(booking.price / 100) * POINTS_PER_100_RUPEES
  const pointsEarned = Math.round(basePoints * multiplier)

  await serviceClient.from('bookings').update({
    status: 'confirmed',
    payment_status: 'paid',
    razorpay_payment_id: razorpayPaymentId,
    razorpay_order_id: razorpayOrderId,
    points_earned: pointsEarned,
  }).eq('id', bookingId)

  const newPoints = (profile?.loyalty_points ?? 0) - (booking.loyalty_discount ?? 0) + pointsEarned
  const newTier = getLoyaltyTier(newPoints)

  await serviceClient.from('profiles').update({
    loyalty_points: newPoints,
    loyalty_tier: newTier,
  }).eq('id', user.id)

  if (booking.loyalty_discount > 0) {
    await serviceClient.from('loyalty_transactions').insert({
      customer_id: user.id,
      type: 'redeem',
      points: -booking.loyalty_discount,
      description: `Redeemed on booking at salon`,
      booking_id: bookingId,
    })
  }

  await serviceClient.from('loyalty_transactions').insert({
    customer_id: user.id,
    type: 'earn',
    points: pointsEarned,
    description: `Earned from confirmed booking`,
    booking_id: bookingId,
  })

  revalidatePath('/loyalty')
  revalidatePath('/profile')
  return { success: true, pointsEarned }
}

export async function submitReview(bookingId: string, rating: number, comment: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('customer_id', user.id)
    .eq('status', 'completed')
    .single()

  if (!booking) return { error: 'Booking not found or not completed' }

  const { error } = await supabase.from('reviews').insert({
    booking_id: bookingId,
    customer_id: user.id,
    salon_id: booking.salon_id,
    rating,
    comment,
  })

  if (error) return { error: error.message }
  revalidatePath('/reviews')
  return { success: true }
}

export async function getLoyaltyHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('loyalty_transactions')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return data ?? []
}
