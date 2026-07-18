import OpenAI from "openai"

/**
 * LM Studio Client
 *
 * Connects to a local LM Studio server running Gemma 12B (or any other model).
 * LM Studio exposes an OpenAI-compatible API at http://localhost:1234/v1
 *
 * Setup:
 * 1. Open LM Studio
 * 2. Download a model (e.g., Gemma 3 12B GGUF)
 * 3. Go to "Local Server" tab → Load model → Start Server
 * 4. Set LMSTUDIO_BASE_URL and LMSTUDIO_MODEL in .env.local
 *
 * For production (Vercel):
 * - Use ngrok or Cloudflare Tunnel to expose your local LM Studio
 * - Set LMSTUDIO_BASE_URL to your tunnel URL (e.g., https://abc.ngrok.io/v1)
 * - Your computer must stay on with LM Studio running
 */

function getLMStudioClient(): OpenAI {
  const baseURL = process.env.LMSTUDIO_BASE_URL || "http://localhost:1234/v1"
  const apiKey = process.env.LMSTUDIO_API_KEY || "lm-studio"

  return new OpenAI({
    baseURL,
    apiKey,
  })
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface LMStudioChatOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  signal?: AbortSignal
}

/**
 * Send a chat completion request to LM Studio
 */
export async function chatWithLMStudio(
  options: LMStudioChatOptions
): Promise<string> {
  const client = getLMStudioClient()
  const model = process.env.LMSTUDIO_MODEL || "gemma-3-12b-it"

  const completion = await client.chat.completions.create(
    {
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    },
    { signal: options.signal }
  )

  return (
    completion.choices?.[0]?.message?.content ||
    "I'm sorry, I couldn't generate a response. Please try again."
  )
}

/**
 * Check if LM Studio is configured (env vars set)
 */
export function isLMStudioConfigured(): boolean {
  return !!process.env.LMSTUDIO_BASE_URL
}

/**
 * Get the model name being used
 */
export function getLMStudioModel(): string {
  return process.env.LMSTUDIO_MODEL || "gemma-3-12b-it"
}

/**
 * Test the LM Studio connection
 * Returns the list of available models
 */
export async function listLMStudioModels(): Promise<string[]> {
  const client = getLMStudioClient()
  const response = await client.models.list()
  return response.data.map((m) => m.id)
}
