'use client'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            background: '#FDF8F5',
            border: '1px solid #EDD8DE',
            color: '#1A1012',
          },
        }}
      />
    </>
  )
}
