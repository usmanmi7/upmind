import OpenAI from "openai"

/**
 * NVIDIA Build API Client
 *
 * Connects to NVIDIA Build (build.nvidia.com) which hosts open models like
 * Kimi K3, GLM-5.2, GLM-4, Gemma 3 12B, Llama 3, Mistral, etc. behind an
 * OpenAI-compatible /v1/chat/completions endpoint.
 *
 * Why this exists:
 *   - Production-grade inference on NVIDIA GPUs, free developer credits
 *   - Works natively on Vercel serverless (no local server needed)
 *   - OpenAI-compatible, so the existing `openai` SDK works out of the box
 *
 * Setup (one-time):
 *   1. Sign in at https://build.nvidia.com
 *   2. Click any model (e.g. moonshotai/kimi-k3) -> "Get API Key"
 *   3. Generate a key (starts with "nvapi-...")
 *   4. In Vercel project settings -> Environment Variables, add:
 *        NVIDIA_API_KEY   = nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *        NVIDIA_MODEL     = moonshotai/kimi-k3           (optional, has sensible default)
 *        NVIDIA_BASE_URL  = https://integrate.api.nvidia.com/v1  (optional)
 *
 * Free tier: 1,000 credits per month (resets monthly). Each chat call costs ~1 credit.
 */

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_MODEL = "moonshotai/kimi-k3"

let cachedClient: OpenAI | null = null

function getNVIDIAClient(): OpenAI {
  if (cachedClient) return cachedClient
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    throw new Error(
      "NVIDIA_API_KEY env var is not set. Get a free key at https://build.nvidia.com and add it in Vercel project settings."
    )
  }
  cachedClient = new OpenAI({
    baseURL: process.env.NVIDIA_BASE_URL || DEFAULT_BASE_URL,
    apiKey,
  })
  return cachedClient
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface NVIDIAChatOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  topP?: number
  signal?: AbortSignal
}

/**
 * Send a chat completion request to NVIDIA Build (GLM / Gemma / Llama etc.)
 * Returns the assistant text.
 */
export async function chatWithNVIDIA(
  options: NVIDIAChatOptions
): Promise<string> {
  const client = getNVIDIAClient()
  const model = process.env.NVIDIA_MODEL || DEFAULT_MODEL

  const completion = await client.chat.completions.create(
    {
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
      top_p: options.topP ?? 0.95,
      stream: false,
    },
    { signal: options.signal }
  )

  return (
    completion.choices?.[0]?.message?.content ||
    "I'm sorry, I couldn't generate a response. Please try again."
  )
}

/**
 * Check if NVIDIA Build is configured (env var present).
 * Used by the API route to decide whether to use NVIDIA or fall back.
 */
export function isNVIDIAConfigured(): boolean {
  return !!process.env.NVIDIA_API_KEY
}

/**
 * Get the model name being used (for display in the UI).
 */
export function getNVIDIAModel(): string {
  return process.env.NVIDIA_MODEL || DEFAULT_MODEL
}

/**
 * Pretty label for the badge in the UI.
 *
 * Always returns "Enginest 5.1" for user-facing display, regardless of the
 * underlying model configured via NVIDIA_MODEL. The actual model ID (e.g.
 * "z-ai/glm-5.2") is still used for API calls — this function only controls
 * the brand label shown to users in the chat header and badge.
 *
 * To change the displayed version, edit the string below. To change the
 * actual underlying model, set the NVIDIA_MODEL env var.
 */
export function getNVIDIAModelLabel(): string {
  return "Enginest 5.1"
}

/**
 * List models available on the configured NVIDIA Build account.
 * Useful for debugging / picking a model.
 */
export async function listNVIDIAModels(): Promise<string[]> {
  const client = getNVIDIAClient()
  const response = await client.models.list()
  return response.data.map((m) => m.id)
}
