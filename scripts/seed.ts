import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const IMG = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80&fit=crop`

const DEFAULT_HOURS = {
  monday: { open: '09:00', close: '20:00' },
  tuesday: { open: '09:00', close: '20:00' },
  wednesday: { open: '09:00', close: '20:00' },
  thursday: { open: '09:00', close: '20:00' },
  friday: { open: '09:00', close: '20:00' },
  saturday: { open: '10:00', close: '20:00' },
  sunday: { open: '10:00', close: '18:00' },
}

const SALONS = [
  { name: 'Lumière Studio', slug: 'lumiere-studio', tagline: 'Parisian hair artistry in Bandra', area: 'Bandra West', lat: 19.0596, lng: 72.8295, category: ['Hair', 'Makeup', 'Bridal'], priceMin: 1800, priceMax: 12000, rating: 4.9, reviews: 342, cover: IMG('photo-1560066984-138dadb4c035'), about: "Mumbai's most exclusive hair atelier crafting bespoke transformations since 2018." },
  { name: 'Aurore Spa & Beauty', slug: 'aurore-spa', tagline: 'Sanctuary of calm on Juhu Beach', area: 'Juhu', lat: 19.103, lng: 72.8265, category: ['Spa', 'Skin', 'Wellness'], priceMin: 2500, priceMax: 8500, rating: 4.8, reviews: 218, cover: IMG('photo-1540555700478-4be289fbecef'), about: 'Award-winning Ayurvedic therapists with organic products from France and Kerala.' },
  { name: 'Velvet & Gold', slug: 'velvet-gold', tagline: 'Precision nail artistry in Worli', area: 'Worli', lat: 19.0178, lng: 72.8178, category: ['Nails', 'Skin'], priceMin: 800, priceMax: 4500, rating: 4.7, reviews: 190, cover: IMG('photo-1633681122182-6a0a5f71b5c2'), about: "Home of Mumbai's most-booked nail artists with hospital-grade sterilization." },
  { name: 'Maison de Belle', slug: 'maison-de-belle', tagline: 'Bollywood-ready bridal studio', area: 'Colaba', lat: 18.9148, lng: 72.8324, category: ['Bridal', 'Makeup', 'Hair'], priceMin: 3500, priceMax: 25000, rating: 4.9, reviews: 401, cover: IMG('photo-1521590832167-7bcbfaa6381f'), about: 'Voted Best Bridal Studio by Femina. Featured in Vogue India.' },
  { name: 'The Glow Lab', slug: 'the-glow-lab', tagline: 'Science-backed color artistry', area: 'Powai', lat: 19.1197, lng: 72.9096, category: ['Hair'], priceMin: 900, priceMax: 7500, rating: 4.6, reviews: 156, cover: IMG('photo-1522337360788-8b13dee7a37e'), about: 'Olaplex and Wella certified color specialists with custom formulas every visit.' },
  { name: 'Rose Atelier', slug: 'rose-atelier', tagline: 'Skincare meets artistry', area: 'Andheri West', lat: 19.1361, lng: 72.8296, category: ['Hair', 'Skin'], priceMin: 1200, priceMax: 5500, rating: 4.7, reviews: 273, cover: IMG('photo-1580618672591-eb180b1a973f'), about: 'Glass-skin facials and precision cuts using Dermalogica and The Ordinary.' },
  { name: 'Serene Skin Clinic', slug: 'serene-skin', tagline: 'Dermatologist-led facials', area: 'Khar', lat: 19.0693, lng: 72.8365, category: ['Skin'], priceMin: 2000, priceMax: 8000, rating: 4.8, reviews: 167, cover: IMG('photo-1616394584738-fc6e612e71b9'), about: 'Medical-grade HydraFacial and chemical peels with in-house dermatologist.' },
  { name: 'Blush & Bloom', slug: 'blush-bloom', tagline: 'Everyday glam, elevated', area: 'Lower Parel', lat: 18.9982, lng: 72.8289, category: ['Makeup', 'Hair'], priceMin: 1500, priceMax: 9000, rating: 4.5, reviews: 134, cover: IMG('photo-1487412947147-5cebf100ffc2'), about: 'Quick glam for work events and parties. MAC and Huda certified artists.' },
  { name: 'Zenith Wellness Spa', slug: 'zenith-wellness', tagline: 'Full-body reset', area: 'Bandra West', lat: 19.055, lng: 72.835, category: ['Spa', 'Wellness'], priceMin: 3000, priceMax: 12000, rating: 4.9, reviews: 289, cover: IMG('photo-1544161515-4ab6ce6db874'), about: 'Deep tissue, aromatherapy, and hot stone therapy with Jurlique oils.' },
  { name: 'Crown & Co.', slug: 'crown-co', tagline: 'Bridal hair specialists', area: 'Juhu', lat: 19.1, lng: 72.83, category: ['Bridal', 'Hair'], priceMin: 4000, priceMax: 18000, rating: 4.8, reviews: 198, cover: IMG('photo-1512496015851-a90fb38ba796'), about: '200+ brides styled. Sabyasachi-collaborated bridal hair specialists.' },
  { name: 'Polish House', slug: 'polish-house', tagline: 'Nail art gallery', area: 'Andheri West', lat: 19.14, lng: 72.83, category: ['Nails'], priceMin: 600, priceMax: 3500, rating: 4.6, reviews: 145, cover: IMG('photo-1604654894610-df63bc536371'), about: '500+ nail art designs. Gel extensions and chrome finishes.' },
  { name: 'Aura Hair Lounge', slug: 'aura-hair', tagline: 'Keratin & balayage experts', area: 'Worli', lat: 19.02, lng: 72.82, category: ['Hair'], priceMin: 1500, priceMax: 9000, rating: 4.7, reviews: 176, cover: IMG('photo-1580618672591-eb180b1a973f'), about: 'Brazilian keratin and lived-in balayage specialists trained in London.' },
  { name: 'Lotus Day Spa', slug: 'lotus-day-spa', tagline: 'Ayurvedic luxury', area: 'Colaba', lat: 18.92, lng: 72.83, category: ['Spa', 'Skin'], priceMin: 2200, priceMax: 7000, rating: 4.7, reviews: 156, cover: IMG('photo-1571019613454-1cb2f99b2d8b'), about: 'Traditional Ayurvedic treatments with organic Kerala herbs.' },
  { name: 'Studio Noir', slug: 'studio-noir', tagline: 'Editorial makeup house', area: 'Bandra West', lat: 19.06, lng: 72.84, category: ['Makeup'], priceMin: 2500, priceMax: 15000, rating: 4.8, reviews: 212, cover: IMG('photo-1562322140-8baeececf3df'), about: 'Editorial and red-carpet makeup. Worked with Filmfare and Elle India.' },
  { name: 'Silk & Shears', slug: 'silk-shears', tagline: 'Precision cuts for curly hair', area: 'Powai', lat: 19.12, lng: 72.91, category: ['Hair'], priceMin: 800, priceMax: 5000, rating: 4.5, reviews: 98, cover: IMG('photo-1521590832167-7bcbfaa6381f'), about: 'Curly hair specialists using DevaCurl and Ouidad techniques.' },
  { name: 'Glow Rituals', slug: 'glow-rituals', tagline: 'K-beauty skin rituals', area: 'Khar', lat: 19.07, lng: 72.84, category: ['Skin'], priceMin: 1800, priceMax: 6000, rating: 4.6, reviews: 121, cover: IMG('photo-1570172619644-dfd03ed5d881'), about: 'Korean 10-step facials with LED therapy and essence layering.' },
  { name: 'The Bridal Room', slug: 'bridal-room', tagline: 'Complete wedding beauty', area: 'Juhu', lat: 19.105, lng: 72.828, category: ['Bridal', 'Makeup', 'Hair', 'Skin'], priceMin: 5000, priceMax: 35000, rating: 4.9, reviews: 334, cover: IMG('photo-1512496015851-a90fb38ba796'), about: 'End-to-end wedding beauty packages with trials and on-location service.' },
  { name: 'Urban Groom Studio', slug: 'urban-groom', tagline: 'Modern cuts for men & women', area: 'Lower Parel', lat: 19.0, lng: 72.83, category: ['Hair'], priceMin: 500, priceMax: 3500, rating: 4.4, reviews: 87, cover: IMG('photo-1560066984-138dadb4c035'), about: 'Fast, precision cuts in a sleek industrial-chic space.' },
]

const SERVICE_TEMPLATES: Record<string, { name: string; price: number; duration: number; popular?: boolean }[]> = {
  Hair: [
    { name: 'Signature Blowout', price: 1800, duration: 45, popular: true },
    { name: 'Balayage Color', price: 6500, duration: 180, popular: true },
    { name: 'Keratin Treatment', price: 5500, duration: 150 },
    { name: 'Precision Cut & Style', price: 1200, duration: 60 },
  ],
  Makeup: [
    { name: 'Party Glam Makeup', price: 4500, duration: 90, popular: true },
    { name: 'HD Bridal Makeup', price: 12000, duration: 120, popular: true },
    { name: 'Engagement Look', price: 8000, duration: 90 },
  ],
  Spa: [
    { name: 'Deep Tissue Massage', price: 3500, duration: 60, popular: true },
    { name: 'Aromatherapy Ritual', price: 4500, duration: 90 },
    { name: 'Hot Stone Therapy', price: 4000, duration: 75 },
  ],
  Skin: [
    { name: 'HydraFacial MD', price: 4200, duration: 75, popular: true },
    { name: 'Glass Skin Facial', price: 2800, duration: 60 },
    { name: '24K Gold Facial', price: 3200, duration: 60 },
  ],
  Nails: [
    { name: 'Gel Manicure', price: 1200, duration: 45, popular: true },
    { name: 'Nail Art Full Set', price: 2200, duration: 90, popular: true },
    { name: 'Chrome Finish Set', price: 1800, duration: 60 },
  ],
  Bridal: [
    { name: 'Bridal Trial Session', price: 5000, duration: 120, popular: true },
    { name: 'Complete Bridal Package', price: 25000, duration: 240, popular: true },
    { name: 'Mehendi & Makeup Combo', price: 15000, duration: 180 },
  ],
  Wellness: [
    { name: 'Ayurvedic Abhyanga', price: 3800, duration: 90, popular: true },
    { name: 'Shirodhara Session', price: 4200, duration: 60 },
  ],
}

const STYLIST_NAMES = [
  ['Priya Sharma', 'Senior Colorist', 'Balayage & Color Correction', 10],
  ['Riya Mehta', 'Makeup Artist', 'Bridal & Editorial', 8],
  ['Ananya Verma', 'Spa Therapist', 'Deep Tissue & Ayurvedic', 6],
  ['Kavya Nair', 'Skin Specialist', 'HydraFacial & Peels', 7],
  ['Sneha Malhotra', 'Hair Stylist', 'Cuts & Styling', 5],
]

const REVIEW_COMMENTS = [
  { rating: 5, comment: 'Absolute magic! The consultation was thorough and the results exceeded expectations.' },
  { rating: 5, comment: 'Luxurious yet welcoming. Already booked my next appointment.' },
  { rating: 4, comment: 'Great service with a small wait, but completely worth it. Will return.' },
  { rating: 5, comment: 'Best treatment I have had in Mumbai. Glowing for two full weeks.' },
  { rating: 4, comment: 'Professional team, clean space, and fair pricing for the quality.' },
  { rating: 5, comment: 'My go-to salon now. The stylist really understood my hair type.' },
  { rating: 3, comment: 'Good experience overall. Booking process could be smoother.' },
  { rating: 5, comment: 'Transformed my look completely. Highly recommend for bridal.' },
]

async function seed() {
  console.log('🌸 Seeding GlowCity AI database...\n')

  // Clear existing seed data (keep user data)
  await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('salon_embeddings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('stylists').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('salons').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  for (const salon of SALONS) {
    const { data: inserted, error } = await supabase.from('salons').insert({
      name: salon.name,
      slug: salon.slug,
      tagline: salon.tagline,
      about: salon.about,
      category: salon.category,
      city: 'Mumbai',
      area: salon.area,
      address: `${salon.area}, Mumbai, Maharashtra`,
      lat: salon.lat,
      lng: salon.lng,
      phone: '+91 98200 ' + String(Math.floor(Math.random() * 90000 + 10000)),
      price_range_min: salon.priceMin,
      price_range_max: salon.priceMax,
      rating: salon.rating,
      review_count: salon.reviews,
      verified: true,
      cover_image_url: salon.cover,
      gallery_urls: [salon.cover],
      amenities: ['Free Wi-Fi', 'AC', 'Complimentary Beverages', 'Sterilized Tools'],
      hours: DEFAULT_HOURS,
      status: 'approved',
    }).select().single()

    if (error || !inserted) {
      console.error(`Failed to insert ${salon.name}:`, error?.message)
      continue
    }

    console.log(`✓ ${salon.name}`)

    // Services
    for (const cat of salon.category) {
      const templates = SERVICE_TEMPLATES[cat] ?? SERVICE_TEMPLATES.Hair
      for (const svc of templates.slice(0, cat === salon.category[0] ? 4 : 2)) {
        await supabase.from('services').insert({
          salon_id: inserted.id,
          category: cat,
          name: svc.name,
          description: `Premium ${svc.name.toLowerCase()} at ${salon.name}.`,
          duration_minutes: svc.duration,
          price: Math.round(svc.price * (0.9 + Math.random() * 0.2)),
          original_price: svc.price,
          image_url: salon.cover,
          is_popular: svc.popular ?? false,
        })
      }
    }

    // Stylists
    const stylistCount = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < stylistCount; i++) {
      const [name, role, speciality, exp] = STYLIST_NAMES[i % STYLIST_NAMES.length]
      await supabase.from('stylists').insert({
        salon_id: inserted.id,
        name,
        role,
        speciality,
        experience_years: exp,
        rating: 4.5 + Math.random() * 0.4,
        image_url: IMG('photo-1559599101-f09722fb4948'),
        languages: ['English', 'Hindi', 'Marathi'],
      })
    }

    // Generate embeddings if OpenRouter key available
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const { generateSalonEmbedding } = await import('../lib/actions/recommendations')
        await generateSalonEmbedding(inserted.id)
        console.log(`  ↳ embedding generated`)
      } catch {
        console.log(`  ↳ embedding skipped (rate limit)`)
      }
    }
  }

  console.log(`\n✅ Seeded ${SALONS.length} salons with services and stylists.`)
  console.log('Run the app and sign up to start booking!')
}

seed().catch(console.error)
