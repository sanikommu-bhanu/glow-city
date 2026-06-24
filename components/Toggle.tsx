'use client'
import { useState } from 'react'

interface ToggleProps {
  defaultOn?: boolean
  onChange?: (v: boolean) => void
}

export default function Toggle({ defaultOn = false, onChange }: ToggleProps) {
  const [on, setOn] = useState(defaultOn)
  const toggle = () => {
    setOn(!on)
    onChange?.(!on)
  }
  return (
    <div className={`toggle-base ${on ? 'on' : ''}`} onClick={toggle}>
      <div className="toggle-thumb" />
    </div>
  )
}
