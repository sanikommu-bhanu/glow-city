import { NextRequest, NextResponse } from 'next/server'

// In-memory store (replace with DB in production)
const bookings: any[] = []

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { salon, service, stylist, date, time, paymentMethod, notes, userId } = body

    if (!salon || !service || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const gst = Math.round(service.price * 0.18)
    const pointsDiscount = 245
    const total = service.price + gst - pointsDiscount

    const booking = {
      id: `GC${Date.now()}`,
      userId: userId || 'user_001',
      salon: { id: salon.id, name: salon.name, area: salon.area, phone: salon.phone, image: salon.image },
      service: { id: service.id, name: service.name, duration: service.duration, price: service.price },
      stylist: stylist ? { id: stylist.id, name: stylist.name, role: stylist.role } : null,
      date,
      time,
      paymentMethod,
      notes: notes || '',
      status: 'confirmed',
      pricing: { base: service.price, gst, pointsDiscount, total },
      pointsEarned: Math.floor(service.price / 1000) * 200,
      createdAt: new Date().toISOString(),
      confirmationCode: `GCB${Math.floor(10000 + Math.random() * 90000)}`,
    }

    bookings.push(booking)

    return NextResponse.json({ booking, success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || 'user_001'
  const userBookings = bookings.filter(b => b.userId === userId)
  return NextResponse.json({ bookings: userBookings })
}
