/**
 * AI Provider System for Enginest
 *
 * Uses a multi-provider fallback strategy:
 * 1. Z AI SDK (primary - works in local development with internal gateway)
 * 2. Google Gemini API (fallback - works on Vercel/production)
 *
 * Environment Variables:
 * - GOOGLE_AI_API_KEY: Required for Vercel deployment. Get a free key at https://aistudio.google.com/apikey
 * - ZAI_BASE_URL: Override the Z AI gateway URL (defaults to internal IP)
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

// ─── Z AI Config ───────────────────────────────────────────────────────────────

interface ZAIConfig {
  baseUrl: string
  apiKey: string
  chatId: string
  userId: string
  token: string
}

const DEFAULT_ZAI_CONFIG: ZAIConfig = {
  baseUrl: "http://172.25.136.193:8080/v1",
  apiKey: "Z.ai",
  chatId: "chat-5c11e67a-af40-431f-a295-b2209fa8e0e9",
  userId: "d8fa2c60-c0ad-4430-b668-c810de94b5bc",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDhmYTJjNjAtYzBhZC00NDMwLWI2NjgtYzgxMGRlOTRiNWJjIiwiY2hhdF9pZCI6ImNoYXQtNWMxMWU2N2EtYWY0MC00MzFmLWEyOTUtYjIyMDlmYThlMGU5IiwicGxhdGZvcm0iOiJ6YWkifQ.AXT-Q5_vNiWByuPbZSg0N7WTaCdQ7mrabGEhIsE_s2Q",
}

function getZAIConfig(): ZAIConfig {
  return {
    baseUrl: process.env.ZAI_BASE_URL || DEFAULT_ZAI_CONFIG.baseUrl,
    apiKey: process.env.ZAI_API_KEY || DEFAULT_ZAI_CONFIG.apiKey,
    chatId: process.env.ZAI_CHAT_ID || DEFAULT_ZAI_CONFIG.chatId,
    userId: process.env.ZAI_USER_ID || DEFAULT_ZAI_CONFIG.userId,
    token: process.env.ZAI_TOKEN || DEFAULT_ZAI_CONFIG.token,
  }
}

// ─── Z AI SDK Initialization ──────────────────────────────────────────────────

export async function initZAI() {
  const ZAIModule = await import("z-ai-web-dev-sdk")
  const ZAI = ZAIModule.default

  // Strategy 1: Try ZAI.create() (reads from .z-ai-config file)
  try {
    const zai = await ZAI.create()
    return zai
  } catch {
    // SDK couldn't find config file, continue
  }

  // Strategy 2: Try reading .z-ai-config file manually with fs
  try {
    const fs = await import("fs/promises")
    const path = await import("path")
    const os = await import("os")

    const configPaths = [
      path.join(process.cwd(), ".z-ai-config"),
      path.join(os.homedir(), ".z-ai-config"),
      "/etc/.z-ai-config",
    ]

    for (const filePath of configPaths) {
      try {
        const configStr = await fs.readFile(filePath, "utf-8")
        const config = JSON.parse(configStr)
        if (config.baseUrl && config.apiKey) {
          return new ZAI(config)
        }
      } catch {
        // File doesn't exist or can't be read
      }
    }
  } catch {
    // fs import failed, continue
  }

  // Strategy 3: Use config from env vars with defaults
  const config = getZAIConfig()
  return new ZAI(config)
}

// ─── Google Gemini Provider ───────────────────────────────────────────────────

let geminiInstance: GoogleGenerativeAI | null = null

function getGemini(): GoogleGenerativeAI | null {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) return null
  if (!geminiInstance) {
    geminiInstance = new GoogleGenerativeAI(apiKey)
  }
  return geminiInstance
}

// Models to try in order, each has separate quota limits
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
]

function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return (
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("rate limit") ||
      msg.includes("too many requests") ||
      msg.includes("resource exhausted")
    )
  }
  return false
}

async function geminiChatWithModel(
  gemini: GoogleGenerativeAI,
  modelName: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<string> {
  const model = gemini.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt || undefined,
  })

  // Convert OpenAI-style messages to Gemini format
  const history: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = []
  let lastUserMessage = ""

  for (const msg of messages) {
    if (msg.role === "system") continue
    if (msg.role === "user") {
      lastUserMessage = msg.content
      history.push({ role: "user", parts: [{ text: msg.content }] })
    } else if (msg.role === "assistant") {
      history.push({ role: "model", parts: [{ text: msg.content }] })
    }
  }

  // Single message, use simple generateContent
  if (history.length <= 1) {
    const result = await model.generateContent(lastUserMessage)
    return result.response.text()
  }

  // Multi-turn conversation, use chat
  const chat = model.startChat({
    history: history.slice(0, -1),
  })

  const result = await chat.sendMessage(lastUserMessage)
  return result.response.text()
}

async function geminiChat(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<string> {
  const gemini = getGemini()
  if (!gemini) {
    throw new Error("Google AI API key not configured. Set GOOGLE_AI_API_KEY environment variable.")
  }

  // Try each model in order, fall back if quota is exceeded
  let lastError: unknown = null

  for (const modelName of GEMINI_MODELS) {
    try {
      const response = await geminiChatWithModel(gemini, modelName, messages, systemPrompt)
      console.log(`Gemini model ${modelName} succeeded`)
      return response
    } catch (error) {
      lastError = error
      if (isRateLimitError(error)) {
        console.warn(`Gemini model ${modelName} hit rate limit, trying next model...`)
        continue // Try the next model
      }
      // Non-rate-limit error, throw immediately
      throw error
    }
  }

  // All models hit rate limits
  throw lastError
}

// ─── Unified AI Response Function ─────────────────────────────────────────────

export interface AIResponse {
  response: string
  searched: boolean
  provider: "z-ai" | "gemini"
}

/**
 * Get an AI response using the best available provider.
 * Tries Z AI first (for local dev), then falls back to Google Gemini (for Vercel).
 */
export async function getAIResponse(
  messages: Array<{ role: string; content: string }>,
  options?: {
    searchWeb?: boolean
    searchQuery?: string
    systemPrompt?: string
  }
): Promise<AIResponse> {
  const shouldSearch = options?.searchWeb || false
  const searchQuery = options?.searchQuery || ""
  const systemPrompt = options?.systemPrompt

  let searchContext = ""
  let usedProvider: "z-ai" | "gemini" = "z-ai"

  // ── Try Z AI SDK first ──────────────────────────────────────────────
  try {
    const zai = await initZAI()

    // Web search if requested (only available with Z AI)
    if (shouldSearch && searchQuery) {
      try {
        const searchResult = await zai.functions.invoke("web_search", {
          query: searchQuery,
          num: 5,
        })

        if (Array.isArray(searchResult) && searchResult.length > 0) {
          searchContext = searchResult
            .map(
              (
                r: { name?: string; snippet?: string; url?: string },
                i: number
              ) =>
                `[${i + 1}] ${r.name || ""}: ${r.snippet || ""} (${r.url || ""})`
            )
            .join("\n")
        }
      } catch {
        // Search failed, continue without it
      }
    }

    // Build full messages with system prompt
    const fullMessages: Array<{ role: string; content: string }> = [
      ...(systemPrompt
        ? [
            {
              role: "system" as const,
              content: shouldSearch && searchContext
                ? `${systemPrompt}\n\nI found some web search results that might be relevant. Use them to provide accurate, up-to-date information. If the search results are helpful, reference them naturally. If they're not relevant, ignore them.\n\nSearch Results:\n${searchContext}`
                : systemPrompt,
            },
          ]
        : []),
      ...messages,
    ]

    // Call the LLM
    const completion = await zai.chat.completions.create({
      messages: fullMessages.map((m) => ({
        role: m.role as "system" | "user" | "assistant",
        content: m.content,
      })),
    })

    const response =
      completion.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again."

    return {
      response,
      searched: shouldSearch && !!searchContext,
      provider: "z-ai",
    }
  } catch (zaiError) {
    console.warn(
      "Z AI SDK failed, trying Google Gemini fallback:",
      zaiError instanceof Error ? zaiError.message : "Unknown error"
    )
  }

  // ── Fallback: Google Gemini ──────────────────────────────────────────
  try {
    const gemini = getGemini()
    if (!gemini) {
      throw new Error(
        "Google AI API key not configured. To use the AI assistant on this deployment, please add your GOOGLE_AI_API_KEY environment variable. You can get a free API key at https://aistudio.google.com/apikey"
      )
    }

    // Build system prompt with search context if available
    let finalSystemPrompt = systemPrompt || ""
    if (shouldSearch && searchContext && finalSystemPrompt) {
      finalSystemPrompt += `\n\nI found some web search results that might be relevant. Use them to provide accurate, up-to-date information. If the search results are helpful, reference them naturally. If they're not relevant, ignore them.\n\nSearch Results:\n${searchContext}`
    }

    const response = await geminiChat(messages, finalSystemPrompt || undefined)

    usedProvider = "gemini"

    return {
      response,
      searched: shouldSearch && !!searchContext,
      provider: usedProvider,
    }
  } catch (geminiError) {
    console.error(
      "Google Gemini also failed:",
      geminiError instanceof Error ? geminiError.message : "Unknown error"
    )
    throw geminiError
  }
}

// ─── Legacy functions (kept for backward compatibility) ───────────────────────

/**
 * @deprecated Use getAIResponse() instead
 */
export async function directAIChat(
  messages: Array<{ role: string; content: string }>,
  options?: { searchWeb?: boolean; searchQuery?: string }
): Promise<{ response: string; searched: boolean }> {
  const result = await getAIResponse(messages, {
    searchWeb: options?.searchWeb,
    searchQuery: options?.searchQuery,
    systemPrompt: `You are a helpful AI assistant on the Enginest platform. You can help users with ANY topic, not just startups. Feel free to answer questions about technology, science, health, education, business, creative writing, programming, current events, and anything else. Be helpful, accurate, and conversational.

Format your responses clearly. Use markdown formatting when helpful (headers, bullet points, bold, code blocks). Be concise but thorough.`,
  })
  return { response: result.response, searched: result.searched }
}
