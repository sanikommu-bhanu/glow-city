'use client'
import { useRouter } from 'next/navigation'

interface BackHeaderProps {
  title?: string
  backHref?: string
  right?: React.ReactNode
  transparent?: boolean
}

export default function BackHeader({ title, backHref, right, transparent }: BackHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) router.push(backHref)
    else router.back()
  }

  return (
    <div
      className={`flex items-center justify-between px-5 py-3.5 sticky top-0 z-50 ${
        transparent ? '' : 'glass border-b border-[rgba(237,216,222,0.5)]'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[18px] text-[#1A1012] transition-transform hover:scale-105"
          style={{ boxShadow: '0 4px 16px rgba(183,110,121,0.14)' }}
        >
          ←
        </button>
        {title && (
          <span className="font-cormorant text-xl font-semibold text-[#1A1012]">{title}</span>
        )}
      </div>
      {right}
    </div>
  )
}
