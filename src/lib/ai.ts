/**
 * Initialize the ZAI SDK.
 * Uses multiple fallback strategies to find the AI service config:
 * 1. Try ZAI.create() (reads from .z-ai-config file via SDK)
 * 2. Try reading .z-ai-config file manually with fs
 * 3. Try environment variables (ZAI_BASE_URL, ZAI_API_KEY, etc.)
 * 4. Use hardcoded defaults from the platform config
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
  // Priority: env vars > defaults
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
    // SDK couldn't find config file, continue to other strategies
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
        // File doesn't exist or can't be read, try next path
      }
    }
  } catch {
    // fs import failed (edge runtime?), continue
  }

  // Strategy 3: Use config from env vars with defaults
  const config = getConfig()
  return new ZAI(config)
}
