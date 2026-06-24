import { NextRequest, NextResponse } from 'next/server'

// ─── Intent classifier ──────────────────────────────────────────────────────
function classifyIntent(text: string): string {
  const t = text.toLowerCase()
  if (/\b(hair|salon|color|colour|balayage|cut|keratin|blowout|highlights?|stylist)\b/.test(t)) return 'hair'
  if (/\b(skin|facial|acne|glow|hydra|pore|moistur|serum|vitamin c|spf|sunscreen)\b/.test(t)) return 'skin'
  if (/\b(makeup|bridal|foundation|lipstick|eyeshadow|contour|wedding|bride)\b/.test(t)) return 'makeup'
  if (/\b(spa|massage|relax|stress|therapy|aromatherapy|deep tissue|body|wellness)\b/.test(t)) return 'spa'
  if (/\b(nail|nails|manicure|pedicure|gel|acrylic|nail art|ombre nail)\b/.test(t)) return 'nails'
  if (/\b(book|appointment|schedule|reserve|available|slot|when)\b/.test(t)) return 'booking'
  if (/\b(price|cost|how much|cheap|budget|expensive|afford)\b/.test(t)) return 'price'
  if (/\b(near|nearby|close|location|distance|km|area|bandra|juhu|worli|colaba|powai|andheri)\b/.test(t)) return 'location'
  if (/\b(point|reward|loyalty|cashback|discount|offer|deal)\b/.test(t)) return 'loyalty'
  if (/\b(trend|trending|popular|best|top|recommend|suggest)\b/.test(t)) return 'trending'
  if (/\b(dry|oily|sensitive|combination|normal|skin type)\b/.test(t)) return 'skintype'
  return 'general'
}

// ─── Rich contextual responses ──────────────────────────────────────────────
const RESPONSES: Record<string, string[]> = {
  hair: [
    "Based on your booking history, I'd recommend **Lumière Studio** in Bandra West — their Senior Colorist Priya has a 4.9★ rating and a slot open tomorrow at 3 PM! 🎨\n\nShe specializes in Balayage and color correction — want me to pre-fill the booking form for you?",
    "For hair services, **The Glow Lab** in Powai is trending this week (+34% bookings). They're Olaplex-certified and have a special: free Olaplex treatment with any color service until Sunday! ✂️",
  ],
  skin: [
    "For your combination skin type, I'd recommend the **HydraFacial MD** at Aurore Spa — it's medical-grade and perfect for balancing oiliness while deeply hydrating. They have a Tuesday morning slot. ✨\n\n*Pro tip: Avoid retinoids 3 days before for best results.*",
    "**Rose Atelier** in Andheri uses a skin analysis device to customize treatments. Their Glass Skin Facial is trending right now — 89% of customers see results after one session! 🌿",
  ],
  makeup: [
    "For your upcoming event, **Maison de Belle** in Colaba is the #1 pick — 4.9★, 401 reviews, Vogue India featured. Their artist Riya specializes in HD and airbrush looks that last 18+ hours. 💄\n\nShall I check availability for your date?",
    "**Lumière Studio** just got a new HD makeup station! Their bridal trials are ₹3,000 (deducted from booking if you proceed). 3 slots left this week. 💍",
  ],
  spa: [
    "You haven't had a wellness session in a while — I'd prioritize it! 🌿\n\n**Aurore Spa** on Juhu has a 90-min Aromatherapy Massage with warm stone therapy at 6 PM today (just 1 slot left). Sea-view therapy room — truly luxurious.",
    "For deep stress relief, **Aurore's** Deep Tissue Massage (₹3,500) uses doTERRA essential oils and targets chronic tension points. Their therapist Ananya has a 4.7★ rating with 98 reviews. 💆‍♀️",
  ],
  nails: [
    "**Velvet & Gold** in Worli just launched their Autumn 2025 nail art collection! Their top artist has a 2:30 PM slot today. They're known for 3D nail art and gel extensions — hospital-grade sterilization. 💅\n\nFull set starts at ₹2,200.",
    "Trending nail styles this week: Aurora chrome, Glazed donut, and Dark florals. **Velvet & Gold** can do all three — they have 500+ designs in their catalogue!",
  ],
  booking: [
    "I can book for you instantly! 🗓️ Here's what's available in the next 48 hours:\n\n• **Lumière Studio** — Today 5 PM (Blowout)\n• **Aurore Spa** — Tomorrow 10 AM (HydraFacial)\n• **Velvet & Gold** — Tomorrow 2 PM (Nail Art)\n\nWhich one interests you?",
    "To book, just tap any salon card and I'll pre-fill your preferences. Or tell me the service + date and I'll find the best match! 📅",
  ],
  price: [
    "Here's the GlowCity price guide for you:\n\n💇 Hair: ₹1,200 – ₹6,500\n💄 Makeup: ₹1,500 – ₹12,000\n💆 Spa: ₹2,500 – ₹4,500\n💅 Nails: ₹800 – ₹2,200\n✨ Skin: ₹1,800 – ₹4,200\n\nYour **2,450 Glow Points** = ₹245 off any booking! Use them?",
    "As a Gold Tier member you get **priority booking + 10% off** at all partner salons. Your points expire in 8 months — let's use them! 💎",
  ],
  location: [
    "Nearest salons to you right now:\n\n📍 **Lumière Studio** — Bandra West (0.8 km) · No Wait\n📍 **Rose Atelier** — Andheri West (1.2 km) · ~15 min wait\n📍 **The Glow Lab** — Powai (2.1 km) · No Wait\n\nAll are open now. Want directions?",
    "I'm using your saved location: Mumbai. The closest salon with **no wait time** right now is **Lumière Studio** in Bandra West. Shall I book it?",
  ],
  loyalty: [
    "Your **Glow Rewards** status 💎:\n\n• **Points:** 2,450 (₹245 value)\n• **Tier:** Gold\n• **Next milestone:** 3,750 pts = Platinum\n• **Expiry:** 8 months\n\nYou're just **1,300 points away from Platinum** — that unlocks free monthly facials! Book once more to get there. 🚀",
    "Ways to earn more points fast:\n\n⭐ Leave a review → +50 pts\n👥 Refer a friend → +500 pts each\n📅 Book any service → +200 pts/₹1,000\n🎂 Your birthday bonus → +1,000 pts\n\nTip: refer 2 friends this week for instant Gold → Platinum upgrade!",
  ],
  trending: [
    "Trending this week on GlowCity 🔥:\n\n1. **Glazed Donut Nails** — +210% searches\n2. **Glass Skin Facial** — 89% satisfaction\n3. **Lived-in Balayage** — Most booked color\n4. **Hot Stone Massage** — #1 for stress relief\n5. **Ombre Brows** — New at 3 salons!\n\nWant to book any of these?",
    "**Aurore Spa's** Gold Facial is this month's viral treatment — 2,400 Instagram tags! Also trending: Korean glass-skin protocol at **Rose Atelier**. Both have slots this week. ✨",
  ],
  skintype: [
    "For **dry skin**: I recommend the 24K Gold Facial (deeply nourishing) or Aromatherapy Massage (boosts circulation). Use Hyaluronic Acid serums daily.\n\nFor **oily skin**: HydraFacial MD is your best friend — it unclogs pores without stripping. Avoid heavy oils.\n\nFor **sensitive skin**: Glass Skin Facial at Rose Atelier uses fragrance-free, dermatologist-approved products. 🌿",
    "Quick skin-type quiz tip: Press a clean tissue to your face after washing. **Oily patches** = oily/combination. **Tight feeling** = dry. **No residue** = normal. This helps me give better recommendations!",
  ],
  general: [
    "I'm here to be your personal beauty concierge! ✨ I can help you:\n\n• 📅 Book appointments at 500+ salons\n• 💆 Find the perfect treatment for your skin/hair\n• 💎 Track and redeem your Glow Points\n• 🌟 Get personalized style recommendations\n• 📍 Find salons near you with real-time wait times\n\nWhat's on your beauty agenda today?",
    "As your AI beauty assistant, I analyze your booking history, skin profile, and current trends to give you personalized picks. Just ask me anything — from 'what nail color suits me?' to 'book me the best massage near Bandra'! 💅",
  ],
}

// ─── Get contextual weather advice ──────────────────────────────────────────
async function getWeatherAdvice(): Promise<string> {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=19.076&longitude=72.877&current=temperature_2m,weathercode&timezone=Asia/Kolkata',
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    const temp = data?.current?.temperature_2m
    const code = data?.current?.weathercode

    if (temp && temp > 32) return '\n\n☀️ *It\'s hot in Mumbai today — I recommend a hydrating facial or indoor spa session to beat the heat!*'
    if (code && code >= 61 && code <= 67) return '\n\n🌧️ *Rainy day in Mumbai! Perfect time for an indoor spa day. Book a massage and relax.*'
    return ''
  } catch {
    return ''
  }
}

// ─── Route handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message' }, { status: 400 })
    }

    const intent = classifyIntent(message)
    const responsePool = RESPONSES[intent] || RESPONSES.general
    const baseResponse = responsePool[Math.floor(Math.random() * responsePool.length)]

    // Add weather context for spa/skin queries
    let weatherNote = ''
    if (['spa', 'skin', 'general'].includes(intent)) {
      weatherNote = await getWeatherAdvice()
    }

    // Personalize based on history length
    const isReturning = history && history.length > 3
    const prefix = isReturning ? '' : ''

    const response = prefix + baseResponse + weatherNote

    return NextResponse.json({
      response,
      intent,
      suggestions: getSuggestions(intent),
    })
  } catch (err) {
    console.error('AI route error:', err)
    return NextResponse.json({
      response: "I'm having a moment — please try again! In the meantime, explore our featured salons below. ✨",
      intent: 'general',
      suggestions: ['Show featured salons', 'What\'s trending?', 'My bookings'],
    })
  }
}

function getSuggestions(intent: string): string[] {
  const map: Record<string, string[]> = {
    hair: ['Book Lumière Studio', 'See hair services', 'View stylists'],
    skin: ['Book HydraFacial', 'Skin quiz', 'See skin services'],
    makeup: ['Book Maison de Belle', 'Bridal packages', 'See all makeup'],
    spa: ['Book Aurore Spa', 'See spa services', 'Weekend slots'],
    nails: ['Book Velvet & Gold', 'Nail art gallery', 'Gel vs acrylic?'],
    booking: ['Show available slots', 'My bookings', 'Cancel/reschedule'],
    price: ['Use my points', 'Best value services', 'Membership plans'],
    loyalty: ['Redeem points', 'Refer a friend', 'Tier benefits'],
    trending: ['Book trending service', 'See all trending', 'Near me'],
    general: ['Show featured salons', 'What\'s trending?', 'Book appointment'],
  }
  return map[intent] || map.general
}
