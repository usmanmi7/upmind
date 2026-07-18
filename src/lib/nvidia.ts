import OpenAI from "openai"

/**
 * NVIDIA Build API Client
 *
 * Connects to NVIDIA Build (build.nvidia.com) which hosts open models like
 * GLM-5.2, GLM-4, Gemma 3 12B, Llama 3, Mistral, etc. behind an
 * OpenAI-compatible /v1/chat/completions endpoint.
 *
 * Why this exists:
 *   - Production-grade inference on NVIDIA GPUs, free developer credits
 *   - Works natively on Vercel serverless (no local server needed)
 *   - OpenAI-compatible, so the existing `openai` SDK works out of the box
 *
 * Setup (one-time):
 *   1. Sign in at https://build.nvidia.com
 *   2. Click any model (e.g. z-ai/glm-5.2) -> "Get API Key"
 *   3. Generate a key (starts with "nvapi-...")
 *   4. In Vercel project settings -> Environment Variables, add:
 *        NVIDIA_API_KEY   = nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *        NVIDIA_MODEL     = z-ai/glm-5.2               (optional, has sensible default)
 *        NVIDIA_BASE_URL  = https://integrate.api.nvidia.com/v1  (optional)
 *
 * Free tier: 1,000 credits per month (resets monthly). Each chat call costs ~1 credit.
 */

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1"
const DEFAULT_MODEL = "z-ai/glm-5.2"

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
 * Pretty label for the badge in the UI, e.g. "GLM-5.2", "GLM-4 9B", "Gemma 3 12B".
 * Strips the org prefix (e.g. "z-ai/", "thudm/") and common suffixes.
 */
export function getNVIDIAModelLabel(): string {
  const raw = getNVIDIAModel()
  const withoutOrg = raw.split("/").pop() || raw

  // Special case: preserve dotted version numbers like "glm-5.2" -> "GLM-5.2"
  // We do this BEFORE replacing dashes with spaces, so "glm-5.2" stays together.
  // Strategy: temporarily replace ".<digit>" with a placeholder, then restore.
  const protectedVersion = withoutOrg.replace(/\.(\d)/g, "\u0001$1")

  // glm-4-9b-chat -> GLM-4 9B
  // gemma-3-12b-it -> Gemma 3 12B
  // glm-5.2 -> GLM-5.2
  let cleaned = protectedVersion
    .replace(/-chat$/i, "")
    .replace(/-it$/i, "")
    .replace(/-/g, " ")
    .replace(/\b(\d+b)\b/gi, (m) => m.toUpperCase())
    .replace(/\bglm\b/i, "GLM")
    .replace(/\bgemma\b/i, "Gemma")
    .replace(/\bllama\b/i, "Llama")
    .replace(/\bmistral\b/i, "Mistral")

  // Restore dotted versions: "GLM 5\u00012" -> "GLM-5.2"
  // Note: the dash-before-version is now a space; collapse "GLM 5.2" to "GLM-5.2"
  cleaned = cleaned.replace(/\u0001/g, ".").replace(/(GLM|Gemma|Llama|Mistral)\s+(\d+\.\d+)/i, "$1-$2")

  return cleaned
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
