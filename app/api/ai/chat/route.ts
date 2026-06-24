import { NextRequest } from 'next/server'
import { SALONS, SERVICES } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

    let responseText = "I'm sorry, I couldn't quite catch that. Could you ask me about finding a salon, booking a service, or getting a recommendation?"
    let bookingTag = ''

    // Extremely simple keyword matching for the mock AI
    if (lastMessage.includes('hair') || lastMessage.includes('blowout') || lastMessage.includes('color')) {
      const salon = SALONS.find(s => s.name === 'Lumière Studio')!
      const service = SERVICES.find(s => s.name === 'Signature Blowout')!
      responseText = `For hair services, I highly recommend **${salon.name}** in ${salon.area}. They are top-rated (⭐ ${salon.rating}) and use premium products like Wella and Olaplex. Their ${service.name} is fantastic at ₹${service.price}. Would you like me to book this for you?`
      bookingTag = `\n\n[BOOK:${service.id}:lumiere-studio]`
    } 
    else if (lastMessage.includes('spa') || lastMessage.includes('massage') || lastMessage.includes('relax')) {
      const salon = SALONS.find(s => s.name === 'Aurore Spa & Beauty')!
      const service = SERVICES.find(s => s.name === 'Deep Tissue Massage')!
      responseText = `If you're looking to relax, **${salon.name}** in ${salon.area} is a sanctuary of calm. They offer an incredible ${service.name} for ₹${service.price} using organic doTERRA essential oils to completely reset your nervous system.`
      bookingTag = `\n\n[BOOK:${service.id}:aurore-spa-beauty]`
    }
    else if (lastMessage.includes('facial') || lastMessage.includes('skin')) {
      const salon = SALONS.find(s => s.name === 'Rose Atelier')!
      const service = SERVICES.find(s => s.name === 'Glass Skin Facial')!
      responseText = `For skincare, you absolutely must visit **${salon.name}**. They specialize in a Korean-inspired ${service.name} (₹${service.price}) that will give you a luminous, mirror-like complexion. It includes essence layering and LED light therapy.`
      bookingTag = `\n\n[BOOK:${service.id}:rose-atelier]`
    }
    else if (lastMessage.includes('nail') || lastMessage.includes('manicure')) {
      const salon = SALONS.find(s => s.name === 'Velvet & Gold')!
      const service = SERVICES.find(s => s.name === 'Nail Art Full Set')!
      responseText = `For the best nails in Mumbai, check out **${salon.name}** in ${salon.area}. They offer stunning custom gel nail art and extensions. The ${service.name} is ₹${service.price} and you can choose from over 500 catalogue designs.`
      bookingTag = `\n\n[BOOK:${service.id}:velvet-gold]`
    }
    else if (lastMessage.includes('point') || lastMessage.includes('loyalty') || lastMessage.includes('reward')) {
      responseText = `You currently have **2,450 Glow Points**! You are a Gold tier member, which means you have about ₹245 in cashback available to use on your next booking. You are only 2,550 points away from Platinum status! 💎`
    }
    else if (lastMessage.includes('hi') || lastMessage.includes('hello') || lastMessage.includes('hey')) {
      responseText = `Hello! 👋 I'm GlowAI. I can help you find the perfect salon, recommend services based on your skin or hair type, or check your loyalty points. What are you looking for today?`
    }

    const fullResponse = responseText + bookingTag

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        // Stream the response out word by word to look like a real LLM
        const words = fullResponse.split(' ')
        for (const word of words) {
          await new Promise(r => setTimeout(r, 40 + Math.random() * 40)) // Random delay 40-80ms
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI Mock Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to process AI chat.' }), { status: 500 })
  }
}
