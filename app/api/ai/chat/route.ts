import { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createChatCompletion } from '@/lib/ai/client'
import { AI_CONFIG } from '@/lib/ai/config'

export async function POST(request: NextRequest) {
  const { messages, conversationId } = await request.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const city = profile?.city ?? 'Mumbai'
  const { data: salons } = await supabase
    .from('salons')
    .select('id, name, slug, area, rating, price_range_min, price_range_max, category, tagline')
    .eq('status', 'approved')
    .eq('city', city)
    .limit(12)

  const salonIds = (salons ?? []).map((s) => s.id)
  const { data: services } = salonIds.length
    ? await supabase.from('services').select('id, salon_id, name, price, category, duration_minutes, image_url').in('salon_id', salonIds).limit(30)
    : { data: [] }

  const salonContext = (salons ?? []).map((s) => {
    const salonServices = (services ?? []).filter((sv) => sv.salon_id === s.id)
    return `${s.name} (${s.area}) — ${s.tagline ?? ''}. Categories: ${(s.category ?? []).join(', ')}. Rating: ${s.rating}. Price from ₹${s.price_range_min}. Services: ${salonServices.map((sv) => `${sv.name} ₹${sv.price}`).join(', ')}`
  }).join('\n')

  const systemPrompt = `You are GlowAI, the personal beauty concierge for GlowCity AI — India's premium salon marketplace.

USER PROFILE:
- Name: ${profile?.full_name ?? 'Guest'}
- City: ${profile?.city ?? 'Mumbai'}, Area: ${profile?.area ?? 'Not set'}
- Skin type: ${profile?.skin_type ?? 'Not specified'}
- Hair type: ${profile?.hair_type ?? 'Not specified'}
- Concerns: ${(profile?.concerns ?? []).join(', ') || 'None specified'}
- Loyalty points: ${profile?.loyalty_points ?? 0}

AVAILABLE SALONS AND SERVICES (ONLY recommend from this list):
${salonContext || 'No salons available in this city yet.'}

RULES:
1. Only recommend salons and services from the provided context. Never invent names, prices, or availability.
2. Be warm, concise, and premium in tone — like a luxury salon concierge.
3. When the user wants to book, respond with a clear recommendation and include a booking tag in this exact format on its own line:
   [BOOK:{service_id}:{salon_slug}]
4. Reference actual prices from the context.
5. Keep responses under 150 words unless explaining a treatment.`

  try {
    const stream = await createChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-8).map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      true
    )

    const encoder = new TextEncoder()
    let fullResponse = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream as AsyncIterable<{ choices: { delta: { content?: string } }[] }>) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) {
              fullResponse += text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }

          // Persist conversation
          const updatedMessages = [
            ...messages,
            { role: 'assistant', content: fullResponse, timestamp: Date.now() },
          ]

          if (conversationId) {
            await supabase
              .from('ai_conversations')
              .update({ messages: updatedMessages, updated_at: new Date().toISOString() })
              .eq('id', conversationId)
          } else if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const serviceClient = await createServiceClient()
            await serviceClient.from('ai_conversations').insert({
              customer_id: user.id,
              messages: updatedMessages,
            })
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          const fallback = AI_CONFIG.rateLimitFallback
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallback, fallback: true })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    return new Response(
      JSON.stringify({ error: AI_CONFIG.rateLimitFallback }),
      { status: 429 }
    )
  }
}
