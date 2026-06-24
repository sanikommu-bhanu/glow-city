import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(
      'https://world.openbeautyfacts.org/cgi/search.pl?search_terms=hair+serum&search_simple=1&action=process&json=1&page_size=12&fields=product_name,brands,image_url,categories,ingredients_text,nutriscore_grade',
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    const products = (data.products || [])
      .filter((p: any) => p.product_name && p.brands)
      .slice(0, 8)
      .map((p: any, i: number) => ({
        id: i + 1,
        name: p.product_name?.slice(0, 40) || 'Beauty Product',
        brand: p.brands?.split(',')[0]?.trim() || 'Premium Brand',
        category: p.categories?.split(',')[0]?.trim() || 'Hair Care',
        image: p.image_url || `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80&fit=crop`,
        description: p.ingredients_text?.slice(0, 80) + '...' || 'Premium quality product',
        price: Math.floor(Math.random() * 1500 + 300),
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      }))
    return NextResponse.json({ products })
  } catch {
    // Fallback curated products
    return NextResponse.json({
      products: [
        { id: 1, name: 'Olaplex No. 3 Hair Perfector', brand: 'Olaplex', category: 'Hair Treatment', image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=200&q=80&fit=crop', price: 1899, rating: '4.8', description: 'At-home bond repair treatment' },
        { id: 2, name: 'Vitamin C Brightening Serum', brand: 'The Ordinary', category: 'Skin Care', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&q=80&fit=crop', price: 599, rating: '4.6', description: 'Potent 23% Vitamin C formulation' },
        { id: 3, name: 'Hyaluronic Acid 2% + B5', brand: 'The Ordinary', category: 'Skin Care', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80&fit=crop', price: 499, rating: '4.7', description: 'Multi-depth hyaluronic acid serum' },
        { id: 4, name: 'Argan Oil Hair Mask', brand: 'Moroccanoil', category: 'Hair Mask', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80&fit=crop', price: 2200, rating: '4.9', description: 'Intensive restorative treatment' },
        { id: 5, name: 'Rose Hip Seed Oil', brand: 'Trilogy', category: 'Face Oil', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&q=80&fit=crop', price: 1299, rating: '4.5', description: 'Certified organic rosehip oil' },
        { id: 6, name: 'Niacinamide 10% + Zinc', brand: 'The Ordinary', category: 'Skin Care', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&q=80&fit=crop', price: 449, rating: '4.6', description: 'Targets blemishes and oil control' },
      ],
    })
  }
}
