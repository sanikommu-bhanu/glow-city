'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { ChatMessage } from '@/lib/types'
import { formatPrice } from '@/lib/types'

const QUICK_REPLIES = [
  'Book a hair appointment near me',
  'Best facial for combination skin',
  'What salons are open now?',
  'Explain my loyalty points',
]

export default function AIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm GlowAI, your personal beauty concierge. I know your profile and real salons near you. How can I help you glow today?",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  async function send(text: string) {
    if (!text.trim() || streaming) return
    const userMsg: ChatMessage = { role: 'user', content: text.trim(), timestamp: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setStreaming(true)
    setStreamText('')

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })

      if (!res.ok || !res.body) {
        throw new Error('Stream failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                full += parsed.text
                setStreamText(full)
              }
            } catch { /* skip */ }
          }
        }
      }

      const bookingCard = parseBookingTag(full)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: full.replace(/\[BOOK:[^\]]+\]/g, '').trim(), bookingCard, timestamp: Date.now() },
      ])
      setStreamText('')
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'GlowAI is taking a quick breather. Browse our AI recommendations on the home page while I recharge!',
          timestamp: Date.now(),
        },
      ])
    } finally {
      setStreaming(false)
    }
  }

  function parseBookingTag(text: string) {
    const match = text.match(/\[BOOK:([^:]+):([^\]]+)\]/)
    if (!match) return undefined
    return { serviceId: match[1], salonId: match[2], serviceName: '', salonName: '', price: 0 } // salonId is slug
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-white pb-[72px] md:pb-0">
      {/* Header */}
      <div className="bg-gradient-gold px-4 md:px-8 py-5 shadow-gold">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[14px] bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-cormorant font-semibold text-white text-xl">GlowAI</div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-dm text-[11px] text-white/80">Live · OpenRouter streaming</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMessages([messages[0]])}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-[18px] px-4 py-3 font-dm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-gold text-white rounded-br-sm'
                  : 'bg-white border border-border text-text-primary rounded-bl-sm shadow-soft'
              }`}
            >
              {msg.content}
              {msg.bookingCard && (
                <Link
                  href={`/booking?salon=${msg.bookingCard.salonId}&service=${msg.bookingCard.serviceId}`}
                  className="mt-3 block p-3 bg-cream rounded-xl border border-border hover:border-rose-gold/40 transition-colors"
                >
                  <div className="font-dm text-xs font-semibold text-rose-gold">Book this service →</div>
                </Link>
              )}
            </div>
          </div>
        ))}

        {streaming && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[85%] rounded-[18px] px-4 py-3 bg-white border border-border font-dm text-sm ai-stream-cursor">
              {streamText || (
                <span className="text-text-muted italic">GlowAI is thinking about your perfect match...</span>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scroll max-w-3xl mx-auto w-full">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            disabled={streaming}
            className="flex-shrink-0 px-3 py-1.5 rounded-full border border-border bg-white font-dm text-xs text-text-secondary hover:border-rose-gold/40 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="glass border-t border-border p-4 md:px-8">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input) }}
          className="max-w-3xl mx-auto flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about salons, services, bookings..."
            disabled={streaming}
            className="flex-1 rounded-[14px] border border-border px-4 py-3 font-dm text-sm bg-white"
          />
          <Button type="submit" disabled={streaming || !input.trim()} className="px-4">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
