/**
 * Initialize the Z AI SDK.
 * Uses multiple fallback strategies to find the AI service config:
 * 1. Try ZAI.create() (reads from .z-ai-config file via SDK)
 * 2. Try reading .z-ai-config file manually with fs
 * 3. Try environment variables (ZAI_BASE_URL, ZAI_API_KEY, etc.)
 * 4. Use hardcoded defaults
 */

interface ZAIConfig {
  baseUrl: string
  apiKey: string
  chatId: string
  userId: string
  token: string
}

// Default config from the Z AI platform
const DEFAULT_CONFIG: ZAIConfig = {
  baseUrl: "http://172.25.136.193:8080/v1",
  apiKey: "Z.ai",
  chatId: "chat-5c11e67a-af40-431f-a295-b2209fa8e0e9",
  userId: "d8fa2c60-c0ad-4430-b668-c810de94b5bc",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDhmYTJjNjAtYzBhZC00NDMwLWI2NjgtYzgxMGRlOTRiNWJjIiwiY2hhdF9pZCI6ImNoYXQtNWMxMWU2N2EtYWY0MC00MzFmLWEyOTUtYjIyMDlmYThlMGU5IiwicGxhdGZvcm0iOiJ6YWkifQ.AXT-Q5_vNiWByuPbZSg0N7WTaCdQ7mrabGEhIsE_s2Q",
}

function getConfig(): ZAIConfig {
  return {
    baseUrl: process.env.ZAI_BASE_URL || DEFAULT_CONFIG.baseUrl,
    apiKey: process.env.ZAI_API_KEY || DEFAULT_CONFIG.apiKey,
    chatId: process.env.ZAI_CHAT_ID || DEFAULT_CONFIG.chatId,
    userId: process.env.ZAI_USER_ID || DEFAULT_CONFIG.userId,
    token: process.env.ZAI_TOKEN || DEFAULT_CONFIG.token,
  }
}

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
  const config = getConfig()
  return new ZAI(config)
}

/**
 * Direct HTTP call to the Z AI gateway.
 * Used as a fallback when the SDK fails (e.g., on Vercel where the internal IP is unreachable).
 * Tries the internal gateway first, then the public API.
 */
export async function directAIChat(
  messages: Array<{ role: string; content: string }>,
  options?: { searchWeb?: boolean; searchQuery?: string }
): Promise<{ response: string; searched: boolean }> {
  const config = getConfig()
  let searchContext = ""

  // Web search if requested
  if (options?.searchWeb && options?.searchQuery) {
    try {
      const searchBody = {
        function_name: "web_search",
        args: { query: options.searchQuery, num: 5 },
      }

      // Try internal gateway for search
      try {
        const searchRes = await fetch(`${config.baseUrl}/functions/invoke`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
            "X-Z-AI-From": "Z",
            ...(config.chatId ? { "X-Chat-Id": config.chatId } : {}),
            ...(config.userId ? { "X-User-Id": config.userId } : {}),
            ...(config.token ? { "X-Token": config.token } : {}),
          },
          body: JSON.stringify(searchBody),
          signal: AbortSignal.timeout(10000),
        })

        if (searchRes.ok) {
          const searchData = await searchRes.json()
          if (Array.isArray(searchData) && searchData.length > 0) {
            searchContext = searchData
              .map(
                (
                  r: { name?: string; snippet?: string; url?: string },
                  i: number
                ) =>
                  `[${i + 1}] ${r.name || ""}: ${r.snippet || ""} (${r.url || ""})`
              )
              .join("\n")
          }
        }
      } catch {
        // Internal gateway search failed
      }
    } catch {
      // Search completely failed
    }
  }

  // Build the messages array with system prompt
  const systemMessage = `You are a helpful AI assistant on the Upmind platform. You can help users with ANY topic — not just startups. Feel free to answer questions about technology, science, health, education, business, creative writing, programming, current events, and anything else. Be helpful, accurate, and conversational.

${
  searchContext
    ? `\nI found some web search results that might be relevant. Use them to provide accurate, up-to-date information. If the search results are helpful, reference them naturally. If they're not relevant, ignore them.\n\nSearch Results:\n${searchContext}\n`
    : ""
}

Format your responses clearly. Use markdown formatting when helpful (headers, bullet points, bold, code blocks). Be concise but thorough.`

  const fullMessages = [
    { role: "system", content: systemMessage },
    ...messages,
  ]

  // Try internal gateway first
  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "X-Z-AI-From": "Z",
        ...(config.chatId ? { "X-Chat-Id": config.chatId } : {}),
        ...(config.userId ? { "X-User-Id": config.userId } : {}),
        ...(config.token ? { "X-Token": config.token } : {}),
      },
      body: JSON.stringify({
        messages: fullMessages,
        thinking: { type: "disabled" },
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (res.ok) {
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (content) {
        return { response: content, searched: !!searchContext }
      }
    }
  } catch {
    // Internal gateway failed, try public API
  }

  // Fallback: Try public Z AI API with fresh guest token
  try {
    // Get a fresh guest token from chat.z.ai
    const authRes = await fetch("https://chat.z.ai/api/v1/auths/", {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
      signal: AbortSignal.timeout(10000),
    })

    if (authRes.ok) {
      const authData = await authRes.json()
      const publicToken = authData.token

      if (publicToken) {
        // Use the public API
        const publicRes = await fetch(
          "https://api.z.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicToken}`,
            },
            body: JSON.stringify({
              model: "GLM-5.1",
              messages: fullMessages,
              stream: false,
            }),
            signal: AbortSignal.timeout(30000),
          }
        )

        if (publicRes.ok) {
          const data = await publicRes.json()
          const content = data.choices?.[0]?.message?.content
          if (content) {
            return { response: content, searched: !!searchContext }
          }
        }
      }
    }
  } catch {
    // Public API also failed
  }

  throw new Error(
    "AI service is currently unavailable. The AI gateway could not be reached. This may be due to network restrictions on the deployment environment."
  )
}
