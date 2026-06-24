/** Haversine distance in km */
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function isSalonOpenNow(hours: Record<string, { open: string; close: string; closed?: boolean }>): boolean {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const now = new Date()
  const day = days[now.getDay()]
  const schedule = hours[day]
  if (!schedule || schedule.closed) return false

  const [openH, openM] = schedule.open.split(':').map(Number)
  const [closeH, closeM] = schedule.close.split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const openMins = openH * 60 + openM
  const closeMins = closeH * 60 + closeM
  return nowMins >= openMins && nowMins < closeMins
}

export function generateTimeSlots(
  hours: Record<string, { open: string; close: string; closed?: boolean }>,
  date: string,
  durationMinutes: number,
  bookedSlots: string[] = []
): string[] {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const d = new Date(date)
  const day = days[d.getDay()]
  const schedule = hours[day]
  if (!schedule || schedule.closed) return []

  const [openH, openM] = schedule.open.split(':').map(Number)
  const [closeH, closeM] = schedule.close.split(':').map(Number)
  const slots: string[] = []
  let current = openH * 60 + openM
  const end = closeH * 60 + closeM - durationMinutes

  while (current <= end) {
    const h = Math.floor(current / 60)
    const m = current % 60
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
    if (!bookedSlots.includes(time)) {
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
      const ampm = h >= 12 ? 'PM' : 'AM'
      slots.push(`${displayH}:${String(m).padStart(2, '0')} ${ampm}`)
    }
    current += 30
  }
  return slots
}

export function parseDisplayTimeToDb(display: string): string {
  const match = display.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return '10:00:00'
  let h = parseInt(match[1])
  const m = parseInt(match[2])
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
}

export function canCancelBooking(bookingDate: string, bookingTime: string): boolean {
  const [h, m] = bookingTime.split(':').map(Number)
  const bookingDateTime = new Date(bookingDate)
  bookingDateTime.setHours(h, m, 0, 0)
  const hoursUntil = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60)
  return hoursUntil >= 2
}

export const IMG = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop`

export const DEFAULT_HOURS = {
  monday: { open: '09:00', close: '20:00' },
  tuesday: { open: '09:00', close: '20:00' },
  wednesday: { open: '09:00', close: '20:00' },
  thursday: { open: '09:00', close: '20:00' },
  friday: { open: '09:00', close: '20:00' },
  saturday: { open: '10:00', close: '20:00' },
  sunday: { open: '10:00', close: '18:00', closed: false },
}
