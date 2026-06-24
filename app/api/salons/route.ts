import { NextRequest, NextResponse } from 'next/server'
import { SALONS } from '@/lib/data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'All'
  const sort = searchParams.get('sort') || 'rating'
  const lat = parseFloat(searchParams.get('lat') || '19.076')
  const lng = parseFloat(searchParams.get('lng') || '72.877')

  // Try fetching real OSM hair salons from Overpass API
  let osmSalons: any[] = []
  try {
    const overpassQuery = `[out:json][timeout:10];node["shop"="hairdresser"](around:5000,${lat},${lng});out body 5;`
    const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    const data = await res.json()
    osmSalons = (data.elements || []).slice(0, 3).map((el: any, i: number) => ({
      id: 100 + i,
      name: el.tags?.name || `Local Salon ${i + 1}`,
      area: el.tags?.['addr:suburb'] || el.tags?.['addr:city'] || 'Mumbai',
      city: 'Mumbai',
      lat: el.lat,
      lng: el.lon,
      rating: (3.8 + Math.random() * 1.2).toFixed(1),
      reviews: Math.floor(20 + Math.random() * 80),
      price: '₹' + (800 + Math.floor(Math.random() * 1200)),
      priceNum: 800 + Math.floor(Math.random() * 1200),
      category: 'Hair & Beauty',
      image: `https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&fit=crop`,
      images: [],
      badge: 'Nearby',
      wait: `~${5 + Math.floor(Math.random() * 20)} min`,
      tags: ['Hair', 'Beauty'],
      about: `${el.tags?.name || 'Local salon'} is a neighbourhood beauty studio${el.tags?.phone ? ` — call ${el.tags.phone}` : ''}.`,
      address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || 'Mumbai',
      phone: el.tags?.phone || el.tags?.['contact:phone'] || '+91 000 000 0000',
      hours: el.tags?.opening_hours || 'Mon–Sat 10AM–8PM',
      amenities: ['Walk-in Welcome'],
      established: 2015 + Math.floor(Math.random() * 8),
      instagram: '',
      isOSM: true,
    }))
  } catch {
    // OSM not available — use curated data only
  }

  let salons = [...SALONS, ...osmSalons]

  // Filter
  if (q) {
    salons = salons.filter(s =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.area.toLowerCase().includes(q.toLowerCase()) ||
      s.category.toLowerCase().includes(q.toLowerCase()) ||
      s.tags.some((t: string) => t.toLowerCase().includes(q.toLowerCase()))
    )
  }
  if (category !== 'All') {
    salons = salons.filter(s =>
      s.tags.some((t: string) => t.toLowerCase() === category.toLowerCase())
    )
  }

  // Add distance from user location
  salons = salons.map(s => {
    const dLat = (s.lat - lat) * 111
    const dLng = (s.lng - lng) * 111 * Math.cos(lat * Math.PI / 180)
    const dist = Math.sqrt(dLat * dLat + dLng * dLng)
    return { ...s, distance: Math.round(dist * 10) / 10 }
  })

  // Sort
  if (sort === 'rating') salons.sort((a, b) => Number(b.rating) - Number(a.rating))
  else if (sort === 'price') salons.sort((a, b) => a.priceNum - b.priceNum)
  else if (sort === 'distance') salons.sort((a, b) => (a as any).distance - (b as any).distance)
  else if (sort === 'reviews') salons.sort((a, b) => Number(b.reviews) - Number(a.reviews))

  return NextResponse.json({ salons, total: salons.length })
}
