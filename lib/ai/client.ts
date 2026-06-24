import OpenAI from 'openai'
import { AI_CONFIG } from './config'

function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OpenRouter API key is missing. Set OPENROUTER_API_KEY in your environment.')
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'GlowCity AI',
    },
  })
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < AI_CONFIG.maxRetries; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      const isRateLimit =
        err instanceof Error &&
        (err.message.includes('429') || err.message.toLowerCase().includes('rate'))
      if (isRateLimit && i < AI_CONFIG.maxRetries - 1) {
        await new Promise((r) => setTimeout(r, AI_CONFIG.retryDelayMs * (i + 1)))
        continue
      }
      throw err
    }
  }
  throw lastError
}

export async function createChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  stream = false
) {
  const client = getOpenRouterClient()
  return withRetry(() =>
    client.chat.completions.create({
      model: AI_CONFIG.chatModel,
      messages,
      stream,
      temperature: 0.7,
      max_tokens: 800,
    })
  )
}

export async function createEmbedding(text: string): Promise<number[]> {
  const client = getOpenRouterClient()
  const response = await withRetry(() =>
    client.embeddings.create({
      model: AI_CONFIG.embeddingModel,
      input: text.slice(0, 8000),
    })
  )
  const embedding = response.data[0]?.embedding ?? []
  if (embedding.length !== AI_CONFIG.embeddingDimensions) {
    // Pad or truncate to match pgvector column
    const padded = new Array(AI_CONFIG.embeddingDimensions).fill(0)
    embedding.forEach((v, i) => {
      if (i < AI_CONFIG.embeddingDimensions) padded[i] = v
    })
    return padded
  }
  return embedding
}

export function buildSalonEmbeddingText(salon: {
  name: string
  tagline?: string | null
  about?: string | null
  category?: string[] | null
  services?: { name: string; category: string }[]
}): string {
  const parts = [
    salon.name,
    salon.tagline,
    salon.about,
    ...(salon.category ?? []),
    ...(salon.services?.map((s) => `${s.category}: ${s.name}`) ?? []),
  ]
  return parts.filter(Boolean).join('. ')
}

export function buildProfileEmbeddingText(profile: {
  skin_type?: string | null
  hair_type?: string | null
  concerns?: string[] | null
  preferences?: Record<string, unknown> | null
  city?: string | null
  pastCategories?: string[]
}): string {
  const prefs = profile.preferences ?? {}
  const parts = [
    profile.city ? `City: ${profile.city}` : '',
    profile.skin_type ? `Skin type: ${profile.skin_type}` : '',
    profile.hair_type ? `Hair type: ${profile.hair_type}` : '',
    profile.concerns?.length ? `Concerns: ${profile.concerns.join(', ')}` : '',
    ...(profile.pastCategories ?? []).map((c) => `Previously booked: ${c}`),
    ...Object.entries(prefs).map(([k, v]) => `${k}: ${v}`),
  ]
  return parts.filter(Boolean).join('. ')
}
