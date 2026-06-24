import { cn } from '@/lib/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gradient-to-r from-blush/60 via-soft-pink to-blush/60 bg-[length:200%_100%]',
        className
      )}
      style={{ animation: 'shimmer-bg 1.5s ease-in-out infinite' }}
    />
  )
}

export function SalonCardSkeleton({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex gap-3.5 items-center py-3 px-5">
        <Skeleton className="w-[70px] h-[70px] rounded-[14px] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    )
  }
  return (
    <div className="w-[220px] flex-shrink-0 rounded-[20px] overflow-hidden bg-white shadow-card">
      <Skeleton className="h-[155px] rounded-none" />
      <div className="p-3.5 space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-6 px-4 md:px-8 py-6">
      <Skeleton className="h-12 w-full max-w-lg rounded-[14px]" />
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-9 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
      <Skeleton className="h-28 w-full rounded-[18px]" />
      <div className="flex gap-3.5 overflow-hidden">
        {[1, 2, 3].map(i => (
          <SalonCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
