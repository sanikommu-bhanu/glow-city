import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: booking } = await supabase
      .from('bookings')
      .select('*, salon:salons(name)')
      .eq('id', bookingId)
      .eq('customer_id', user.id)
      .single()

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount: booking.total_amount * 100,
      currency: 'INR',
      receipt: `gc_${bookingId.slice(0, 8)}`,
      notes: {
        booking_id: bookingId,
        salon: (booking.salon as { name?: string })?.name ?? 'GlowCity Salon',
      },
    })

    await supabase
      .from('bookings')
      .update({ razorpay_order_id: order.id })
      .eq('id', bookingId)

    return NextResponse.json({
      orderId: order.id,
      amount: booking.total_amount * 100,
      currency: 'INR',
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('Razorpay order error:', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      await request.json()

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const { confirmPayment } = await import('@/lib/actions/bookings')
    const result = await confirmPayment(bookingId, razorpay_payment_id, razorpay_order_id)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Payment verify error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
