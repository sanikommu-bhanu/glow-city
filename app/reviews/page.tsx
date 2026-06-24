'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import BackHeader from '@/components/BackHeader'
import { IMG } from '@/lib/data'

export default function ReviewsPage() {
  const router = useRouter()
  const { addPoints, user } = useStore()
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!']

  const handleSubmit = () => {
    if (rating === 0) return
    addPoints(50)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8 bg-[#FDF8F5]" style={{ animation: 'scale-in 0.5s ease-out' }}>
        <div className="text-[56px] mb-4">🙏</div>
        <h3 className="font-cormorant font-semibold text-[30px] text-[#1A1012]">Thank you!</h3>
        <p className="font-dm text-[14px] text-[#A08088] mt-3 mb-2">Your review helps the GlowCity community make better choices.</p>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full my-4"
          style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)' }}>
          <span className="text-white text-[14px]">💎</span>
          <span className="font-dm font-bold text-[14px] text-white">+50 Glow Points earned!</span>
        </div>
        <p className="font-dm text-[13px] text-[#A08088] mb-6">New balance: {user.points.toLocaleString()} pts</p>
        <button onClick={() => router.push('/home')}
          className="w-full h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white"
          style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}>
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto no-scroll bg-[#FDF8F5]">
      <BackHeader title="Write a Review" backHref="/profile" />

      <div className="px-5 pb-32">
        {/* Salon reference */}
        <div className="flex items-center gap-3 p-3.5 bg-white rounded-[16px] mb-5"
          style={{ boxShadow: '0 4px 24px rgba(183,110,121,0.1)' }}>
          <img src={IMG('photo-1560066984-138dadb4c035', 200)} className="w-14 h-14 rounded-[13px] object-cover" alt="" />
          <div>
            <div className="font-cormorant font-semibold text-[17px] text-[#1A1012]">Lumière Studio</div>
            <div className="font-dm text-[12px] text-[#A08088] mt-0.5">Balayage Color · Jun 3, 2025</div>
          </div>
        </div>

        {/* Star rating */}
        <div className="text-center mb-5">
          <p className="font-dm text-[14px] text-[#6B4C52] mb-3">How was your experience?</p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
                className="text-[36px] bg-transparent border-none cursor-pointer transition-transform hover:scale-110"
                style={{ color: i <= (hover || rating) ? '#D4AF7F' : '#EDD8DE' }}>
                ★
              </button>
            ))}
          </div>
          <div className="font-dm font-semibold text-[14px] mt-2" style={{ color: '#B76E79', minHeight: 20 }}>
            {labels[hover || rating]}
          </div>
        </div>

        {/* Text review */}
        <div className="mb-4">
          <label className="font-dm text-[12px] font-bold uppercase tracking-[0.1em] text-[#A08088] block mb-2">Your Review</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Tell others about your experience — the service, the ambience, the stylist…"
            rows={5}
            className="w-full rounded-[14px] border border-[#EDD8DE] bg-white px-4 py-3.5 font-dm text-[14px] text-[#1A1012] resize-none"
          />
          <div className="font-dm text-[11px] text-[#A08088] text-right mt-1">{text.length}/500 characters</div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="font-dm text-[12px] font-bold uppercase tracking-[0.1em] text-[#A08088] block mb-2">Quick Tags</label>
          <div className="flex flex-wrap gap-2">
            {['Great value', 'Skilled stylist', 'Clean & hygienic', 'On time', 'Friendly staff', 'Would revisit', 'Good ambience'].map(tag => (
              <button key={tag}
                className="px-3 py-1.5 rounded-full font-dm text-[12px] font-medium cursor-pointer transition-all border"
                style={{ borderColor: '#EDD8DE', background: 'white', color: '#6B4C52' }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Points reminder */}
        <div className="p-3.5 rounded-[14px] flex items-center gap-3" style={{ background: '#F8E8EE', border: '1.5px solid #EDD8DE' }}>
          <span className="text-[22px]">💎</span>
          <div>
            <div className="font-dm font-semibold text-[13px] text-[#1A1012]">Earn +50 Glow Points</div>
            <div className="font-dm text-[11px] text-[#A08088] mt-0.5">For leaving a verified review</div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 glass border-t border-[#EDD8DE] z-50">
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full h-[52px] rounded-[14px] font-dm font-semibold text-[15px] text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#B76E79,#D4AF7F)', boxShadow: '0 8px 24px rgba(183,110,121,0.35)' }}>
          Submit Review ⭐
        </button>
      </div>
    </div>
  )
}
