/**
 * Initialize the ZAI SDK.
 * Works both locally (reads from .z-ai-config file) and on Vercel (reads from env vars).
 *
 * Required environment variables for production:
 * - ZAI_BASE_URL: The API base URL
 * - ZAI_API_KEY: The API key
 * Optional:
 * - ZAI_CHAT_ID, ZAI_USER_ID, ZAI_TOKEN
 */
export async function initZAI() {
  const ZAIModule = await import("z-ai-web-dev-sdk")
  const ZAI = ZAIModule.default

  // Try the standard create() first (reads from .z-ai-config file)
  try {
    const zai = await ZAI.create()
    return zai
  } catch {
    // Config file not found — use environment variables instead
    const baseUrl = process.env.ZAI_BASE_URL
    const apiKey = process.env.ZAI_API_KEY

    if (!baseUrl || !apiKey) {
      throw new Error(
        "AI service not configured. Set ZAI_BASE_URL and ZAI_API_KEY environment variables."
      )
    }

    // Create instance directly with config
    const config = {
      baseUrl,
      apiKey,
      chatId: process.env.ZAI_CHAT_ID || "",
      userId: process.env.ZAI_USER_ID || "",
      token: process.env.ZAI_TOKEN || "",
    }

    return new ZAI(config)
  }
}
