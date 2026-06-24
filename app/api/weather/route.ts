import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat') || '19.076'
  const lng = searchParams.get('lng') || '72.877'

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weathercode,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=3`,
      { next: { revalidate: 1800 } }
    )
    const data = await res.json()
    const current = data.current
    const codes: Record<number, { label: string; icon: string }> = {
      0: { label: 'Clear sky', icon: '☀️' },
      1: { label: 'Mainly clear', icon: '🌤️' },
      2: { label: 'Partly cloudy', icon: '⛅' },
      3: { label: 'Overcast', icon: '☁️' },
      45: { label: 'Foggy', icon: '🌫️' },
      48: { label: 'Icy fog', icon: '🌫️' },
      51: { label: 'Light drizzle', icon: '🌦️' },
      61: { label: 'Rain', icon: '🌧️' },
      63: { label: 'Moderate rain', icon: '🌧️' },
      65: { label: 'Heavy rain', icon: '⛈️' },
      80: { label: 'Rain showers', icon: '🌦️' },
      95: { label: 'Thunderstorm', icon: '⛈️' },
    }
    const wc = current.weathercode
    const weather = codes[wc] || { label: 'Clear', icon: '🌤️' }

    return NextResponse.json({
      temp: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m),
      label: weather.label,
      icon: weather.icon,
      suggestion: getSuggestion(current.temperature_2m, wc),
    })
  } catch {
    return NextResponse.json({ temp: 30, label: 'Clear', icon: '☀️', suggestion: 'Great day for a spa session!', humidity: 65, wind: 10 })
  }
}

function getSuggestion(temp: number, code: number): string {
  if (code >= 61 && code <= 67) return '🌧️ Rainy day — perfect for an indoor spa or massage!'
  if (code >= 80) return '⛈️ Stay cozy with a luxury facial or hair treatment!'
  if (temp > 33) return '☀️ Beat the heat with a cooling HydraFacial or indoor spa!'
  if (temp < 22) return '🌿 Cool weather — ideal for a warm aromatherapy massage!'
  return '✨ Beautiful weather — great day for a glow-up!'
}
