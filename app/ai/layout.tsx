import BottomNav from '@/components/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full relative">
      <div className="h-full overflow-hidden">{children}</div>
      <BottomNav />
    </div>
  )
}
