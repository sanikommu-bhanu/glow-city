'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Heart, MessageCircle, Send, MapPin, Tag } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { GalleryItem } from '@/lib/data'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/cn'

interface GalleryModalProps {
  item: GalleryItem
  onClose: () => void
}

export default function GalleryModal({ item, onClose }: GalleryModalProps) {
  const { likes, toggleLike, comments, addComment, user } = useStore()
  const [commentText, setCommentText] = useState('')
  const isLiked = !!likes[item.id]
  const itemComments = comments[item.id] || []
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)
  
  const handleLike = () => {
    toggleLike(item.id)
    if (!isLiked) {
      setIsLikeAnimating(true)
      setTimeout(() => setIsLikeAnimating(false), 300)
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addComment(item.id, commentText.trim())
    setCommentText('')
  }

  const focusComment = () => {
    commentInputRef.current?.focus()
  }

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-luxury-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-warm-white md:rounded-[24px] rounded-t-[24px] overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header/Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-luxury-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-luxury-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container (Scrollable) */}
        <div className="overflow-y-auto no-scroll flex-1">
          {/* Image */}
          <div className="relative w-full aspect-[4/5] md:aspect-video">
            <Image 
              src={item.imageUrl} 
              alt={item.title} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-dm font-bold tracking-wider px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-cormorant text-white text-3xl font-bold leading-tight">{item.title}</h2>
              <p className="font-dm text-white/80 text-sm mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {item.salonName}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className="flex items-center gap-1.5 group">
                <Heart className={cn(
                  "w-7 h-7 transition-colors", 
                  isLiked ? "fill-rose-gold text-rose-gold" : "text-text-muted group-hover:text-rose-gold",
                  isLikeAnimating && "animate-heart-bounce"
                )} />
              </button>
              <button onClick={focusComment} className="flex items-center gap-1.5 group">
                <MessageCircle className="w-7 h-7 text-text-muted group-hover:text-rose-gold transition-colors" />
              </button>
            </div>
          </div>

          {/* Details & Comments */}
          <div className="p-5 pb-24 bg-white">
            <p className="font-dm text-sm text-text-secondary leading-relaxed mb-6">
              <span className="font-semibold text-luxury-black mr-2">{item.salonName}</span>
              {item.description}
            </p>

            <div className="space-y-4">
              <h3 className="font-dm font-semibold text-sm text-luxury-black mb-4">
                Comments ({itemComments.length})
              </h3>
              
              {itemComments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-soft-pink flex items-center justify-center text-rose-gold font-bold text-xs flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-dm font-semibold text-sm text-luxury-black">{comment.user}</span>
                      <span className="font-dm text-[11px] text-text-muted">
                        {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="font-dm text-sm text-text-secondary mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))}
              
              {itemComments.length === 0 && (
                <p className="font-dm text-sm text-text-muted text-center py-4">No comments yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer (Comment Input + Book) */}
        <div className="border-t border-border bg-white p-3 md:p-4 flex flex-col gap-3 shrink-0">
          <form onSubmit={handleAddComment} className="flex items-center gap-2 relative">
            <div className="w-8 h-8 rounded-full bg-soft-pink flex items-center justify-center text-rose-gold font-bold text-xs flex-shrink-0">
              {user.avatar}
            </div>
            <input 
              ref={commentInputRef}
              type="text" 
              placeholder="Add a comment..." 
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="flex-1 bg-warm-white border border-border rounded-full px-4 py-2 font-dm text-sm focus:border-rose-gold outline-none"
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="w-9 h-9 rounded-full bg-rose-gold text-white flex items-center justify-center disabled:opacity-50 disabled:bg-border transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>

          <Link 
            href={`/booking?salon=${item.salonSlug}&service=${item.serviceId}`}
            className="w-full bg-luxury-black text-white rounded-xl py-3.5 font-dm font-semibold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
          >
            <Tag className="w-4 h-4" />
            Book This Service · ₹{item.price.toLocaleString()}
          </Link>
        </div>
      </div>
    </div>
  )
}
