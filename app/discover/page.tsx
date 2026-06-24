'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Play } from 'lucide-react'
import { SERVICES, STYLISTS, SALON_GALLERY, type GalleryItem, mappedSalons } from '@/lib/data'
import SalonCard from '@/components/SalonCard'
import { useStore } from '@/store/useStore'
import GalleryModal from '@/components/GalleryModal'
import { cn } from '@/lib/cn'

const TABS = ['Gallery', 'Services', 'Stylists', 'Salons', 'Trending']

export default function DiscoverPage() {
  const [tab, setTab] = useState('Gallery')
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null)
  const { likes, toggleLike, comments } = useStore()

  // Split gallery into two columns for masonry effect
  const col1 = SALON_GALLERY.filter((_, i) => i % 2 === 0)
  const col2 = SALON_GALLERY.filter((_, i) => i % 2 !== 0)

  return (
    <div className="h-full overflow-y-auto no-scroll pb-20 bg-[#FDF8F5]">
      {/* Header + Tabs */}
      <div className="glass border-b border-[rgba(237,216,222,0.5)] sticky top-0 z-40 px-5 pt-5 pb-0">
        <h1 className="font-cormorant font-semibold text-[#1A1012] tracking-tight mb-4 text-[32px]">Discover</h1>
        <div className="flex gap-1 overflow-x-auto no-scroll">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 min-w-[80px] py-2.5 rounded-t-[10px] font-dm text-[12px] font-semibold border-none cursor-pointer transition-all"
              style={{
                background: tab === t ? '#F8E8EE' : 'transparent',
                color: tab === t ? '#B76E79' : '#A08088',
                borderBottom: tab === t ? '2px solid #B76E79' : '2px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Tab (Instagram Style) */}
      {tab === 'Gallery' && (
        <div className="px-3 pt-4">
          <div className="masonry-grid">
            {[col1, col2].map((col, colIdx) => (
              <div key={colIdx} className="masonry-column flex-1 flex flex-col gap-3">
                {col.map(item => {
                  const isLiked = !!likes[item.id]
                  const commentCount = comments[item.id]?.length || 0

                  return (
                    <div 
                      key={item.id} 
                      className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => setSelectedGalleryItem(item)}
                    >
                      {/* Random aspect ratio for masonry look */}
                      <div className={cn("relative w-full", item.id % 3 === 0 ? "aspect-[3/4]" : "aspect-square")}>
                        {item.type === 'video' && item.videoUrl ? (
                          <video
                            src={item.videoUrl}
                            poster={item.imageUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Image 
                            src={item.imageUrl} 
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 300px"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-80" />
                        
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <p className="font-cormorant font-semibold text-lg leading-tight line-clamp-1">{item.title}</p>
                          <p className="font-dm text-[10px] opacity-80 mt-0.5 line-clamp-1">{item.salonName}</p>
                        </div>

                        {/* Quick Action Overlay (shows on hover desktop, always mobile) */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button 
                            className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border border-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(item.id);
                            }}
                          >
                            <Heart className={cn("w-4 h-4", isLiked ? "fill-rose-gold text-rose-gold animate-heart-bounce" : "text-white")} />
                          </button>
                          {commentCount > 0 && (
                            <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white font-dm text-xs font-semibold">
                              {commentCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Tab */}
      {tab === 'Services' && (
        <div className="px-5 pt-4">
          {SERVICES.map(sv => (
            <Link href={`/booking?service=${sv.id}`} key={sv.id}>
              <div
                className="flex items-center justify-between p-3.5 bg-white rounded-[14px] mb-2.5 cursor-pointer hover:border-[#B76E79] transition-all"
                style={{ border: '1.5px solid #EDD8DE' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[13px] flex items-center justify-center text-[22px]" style={{ background: '#F8E8EE' }}>{sv.icon}</div>
                  <div>
                    <div className="font-cormorant font-semibold text-[17px] text-[#1A1012]">{sv.name}</div>
                    <div className="font-dm text-[12px] text-[#A08088] mt-0.5">⏱ {sv.duration} · {sv.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-cormorant font-bold text-[18px]" style={{ color: '#B76E79' }}>₹{sv.price.toLocaleString()}</div>
                  <div className="font-dm text-[11px] font-semibold mt-0.5" style={{ color: '#B76E79' }}>Book →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Stylists Tab */}
      {tab === 'Stylists' && (
        <div className="px-5 pt-4">
          {STYLISTS.map(st => (
            <div
              key={st.id}
              className="flex items-center gap-3.5 p-3.5 bg-white rounded-[16px] mb-3"
              style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.12)' }}
            >
              <img src={st.img} alt={st.name} className="w-14 h-14 rounded-[14px] object-cover" />
              <div className="flex-1">
                <div className="font-cormorant font-semibold text-[18px] text-[#1A1012]">{st.name}</div>
                <div className="font-dm text-[12px] text-[#A08088] mt-0.5">{st.role}</div>
                <div className="font-dm text-[11px] text-[#6B4C52] mt-0.5">{st.speciality}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[#D4AF7F] text-[12px]">{'★'.repeat(Math.round(st.rating))}</span>
                  <span className="font-dm text-[12px] text-[#A08088]">{st.rating} ({st.reviews})</span>
                </div>
              </div>
              <Link href="/booking">
                <button
                  className="px-4 py-2 rounded-[10px] font-dm text-[12px] font-bold cursor-pointer hover:bg-rose-gold hover:text-white transition-colors"
                  style={{ background: '#F8E8EE', color: '#B76E79', border: 'none' }}
                >
                  Book
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Salons Tab */}
      {tab === 'Salons' && (
        <div className="px-5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mappedSalons.map((s) => (
              <SalonCard key={s.id} salon={s} wide />
            ))}
          </div>
        </div>
      )}

      {/* Trending Tab */}
      {tab === 'Trending' && (
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            {SALON_GALLERY.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                className="relative rounded-xl overflow-hidden aspect-square cursor-pointer"
                onClick={() => setSelectedGalleryItem(item)}
              >
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white font-dm text-xs font-bold">{item.tags[0]}</div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <Heart className="w-3 h-3 text-rose-gold fill-rose-gold" />
                  <span className="text-[10px] font-dm text-white">{(item.id * 123) % 1000}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedGalleryItem && (
        <GalleryModal 
          item={selectedGalleryItem} 
          onClose={() => setSelectedGalleryItem(null)} 
        />
      )}
    </div>
  )
}
