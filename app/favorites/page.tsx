'use client'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import BackHeader from '@/components/BackHeader'

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      <BackHeader title="Favorites" backHref="/profile" />
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <Heart className="w-12 h-12 text-rose-gold mx-auto mb-4" />
        <h2 className="font-cormorant text-2xl font-semibold mb-2">Save salons you love</h2>
        <p className="font-dm text-sm text-text-muted mb-6">
          Tap the heart on any salon to save it here for quick access.
        </p>
        <Link href="/search" className="font-dm text-sm text-rose-gold font-semibold">
          Explore salons →
        </Link>
      </div>
    </div>
  )
}
