# GlowCity AI

India's AI-powered luxury beauty salon marketplace — built for production with Supabase, OpenRouter, and Razorpay.

## Judging criteria map

| Criterion | Where to look |
|-----------|---------------|
| **Product Thinking** | Two-sided flows: customer booking → payment → loyalty → review; salon owner dashboard; admin approval; double-booking prevention; 2hr cancellation policy; cold-start labels on recommendations |
| **UI/UX Design** | Mobile-first responsive layout (375px+), rose-gold/champagne design system, skeleton loaders, Lucide icons, premium typography (Cormorant + DM Sans) |
| **AI Usage & Innovation** | `/ai` — GlowAI streaming chat grounded in real salon data; Home — "Recommended For You" rail with % match + explainability |
| **Execution Quality** | Real Supabase Postgres + RLS + pgvector; Razorpay test checkout; seed script with 18 Mumbai salons |
| **User Experience** | 3-tap onboarding; geolocation "Near You"; booking in under 60s for returning users |

## Quick start

```bash
npm install
cp .env.local.example .env.local
# Fill in Supabase, OpenRouter, Razorpay keys
```

### 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable **pgvector** extension in Database → Extensions
3. Run `supabase/migrations/001_initial_schema.sql` in SQL Editor
4. Copy URL + anon key + service role key to `.env.local`

### 2. Seed data

```bash
npm run seed
```

Creates 18 realistic Mumbai salons with services, stylists, and optional embeddings.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy (Vercel)

Set all env vars from `.env.local.example` in Vercel project settings.

## Environment variables

See `.env.local.example` for full list.

## 2-minute demo script

1. **Splash → Home** — Show responsive layout and AI recommendation rail with match % badges
2. **Onboarding** — Sign up → 3 taps (area, skin/hair, preferences)
3. **Search** — Filter by category, open now, distance sorting via geolocation
4. **Salon detail** — Gallery, services, stylists, reviews from real DB
5. **Booking** — Pick service → stylist → slot → Razorpay test payment → loyalty points
6. **GlowAI** (`/ai`) — Ask "best facial for combination skin in Bandra" — watch streamed response with real salon names/prices
7. **Loyalty** — Points ledger and tier progress

## Tech stack

- Next.js 14 App Router · TypeScript · Tailwind CSS
- Supabase (Auth, Postgres, RLS, Storage, pgvector)
- OpenRouter (free chat + embeddings via `lib/ai/client.ts`)
- Razorpay test mode
- react-hook-form + zod · Lucide React · sonner toasts

## AI model config

Swap models in one place: `lib/ai/config.ts`
