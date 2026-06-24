/** Swap model names here when OpenRouter free tier changes */
export const AI_CONFIG = {
  chatModel: 'meta-llama/llama-3.1-8b-instruct:free',
  embeddingModel: 'openai/text-embedding-3-small',
  embeddingDimensions: 1536,
  maxRetries: 3,
  retryDelayMs: 1000,
  rateLimitFallback:
    "GlowAI is taking a quick breather due to high demand. Try again in a moment, or browse our curated picks below — they're matched to your profile too!",
} as const
