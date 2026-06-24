interface BookingStepBarProps {
  current: number // 1, 2, or 3
}

export default function BookingStepBar({ current }: BookingStepBarProps) {
  return (
    <div className="flex items-center px-6 pt-1 pb-4 gap-0">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center" style={{ flex: i < 2 ? 1 : 'none' }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
            style={{
              background: n < current ? 'linear-gradient(135deg,#B76E79,#D4AF7F)'
                : n === current ? 'linear-gradient(135deg,#B76E79,#D4AF7F)'
                : '#EDD8DE',
              color: n <= current ? 'white' : '#A08088',
            }}
          >
            {n < current ? '✓' : n}
          </div>
          {i < 2 && (
            <div
              className="h-0.5 flex-1"
              style={{ background: n < current ? 'linear-gradient(90deg,#B76E79,#D4AF7F)' : '#EDD8DE' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
