/**
 * Client-side helper for rendering streaming AI JSON as readable text.
 *
 * Why this exists:
 *   The AI returns structured JSON (e.g.
 *   `{"responseType":"paragraph","heading":"Build something people want",...}`).
 *   When streaming token-by-token, we don't want the user to see raw JSON
 *   syntax (`{"responseType":"par`) flashing on screen. This helper takes
 *   the partial buffer accumulated so far and extracts whatever readable
 *   string content is already complete, so the user sees prose appearing
 *   in real time, then snaps to the polished <AIResponse> view at the end.
 *
 * Approach:
 *   - Try JSON.parse first (works once the stream is complete)
 *   - If that fails, fall back to a regex extractor that pulls string
 *     values out of the partial JSON, handling both complete and
 *     truncated trailing strings
 *   - Escape sequences (\n, \", \\, etc.) are unescaped so the user
 *     sees real newlines and quotes, not the literal `\n` text
 */

import type { StructuredAIResponse } from "@/lib/ai-prompt"

/**
 * Unescape JSON string escape sequences so partial text looks natural.
 * Handles \n, \r, \t, \", \\, \uXXXX (best-effort).
 */
function unescapeJsonString(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\\\/g, "\\")
}

/**
 * Try to parse the buffer as complete JSON. If it succeeds, return a
 * nicely formatted display string (heading, subheading, paragraphs/steps,
 * etc. joined with blank lines). If it fails, return null.
 */
function tryFormatCompleteJson(buffer: string): {
  display: string
  structured: StructuredAIResponse
} | null {
  try {
    // Strip markdown code fences if present
    const cleaned = buffer.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/,"")
    const obj = JSON.parse(cleaned) as Record<string, unknown>
    const parts: string[] = []

    if (typeof obj.heading === "string" && obj.heading) parts.push(obj.heading)
    if (typeof obj.subheading === "string" && obj.subheading) parts.push(obj.subheading)
    if (typeof obj.description === "string" && obj.description) parts.push(obj.description)
    if (Array.isArray(obj.steps)) {
      parts.push(obj.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"))
    }
    if (Array.isArray(obj.paragraphs)) {
      parts.push(obj.paragraphs.join("\n\n"))
    }
    if (typeof obj.answer === "string" && obj.answer) parts.push(obj.answer)
    if (obj.optionA && typeof obj.optionA === "object") {
      const o = obj.optionA as { label?: string; text?: string }
      parts.push(`${o.label || "A"}: ${o.text || ""}`)
    }
    if (obj.optionB && typeof obj.optionB === "object") {
      const o = obj.optionB as { label?: string; text?: string }
      parts.push(`${o.label || "B"}: ${o.text || ""}`)
    }
    if (typeof obj.question === "string" && obj.question) parts.push(obj.question)

    const structured: StructuredAIResponse = {
      responseType: obj.responseType as StructuredAIResponse["responseType"],
      heading: typeof obj.heading === "string" ? obj.heading : undefined,
      description: typeof obj.description === "string" ? obj.description : undefined,
      subheading: typeof obj.subheading === "string" ? obj.subheading : undefined,
      steps: Array.isArray(obj.steps) ? obj.steps.map(String) : undefined,
      paragraphs: Array.isArray(obj.paragraphs) ? obj.paragraphs.map(String) : undefined,
      answer: typeof obj.answer === "string" ? obj.answer : undefined,
      optionA: obj.optionA as StructuredAIResponse["optionA"],
      optionB: obj.optionB as StructuredAIResponse["optionB"],
      question: typeof obj.question === "string" ? obj.question : undefined,
    }

    return { display: parts.filter(Boolean).join("\n\n"), structured }
  } catch {
    return null
  }
}

/**
 * Extract a string value (possibly truncated) for a given key from a
 * partial JSON buffer. Returns the unescaped text or empty string.
 */
function extractPartialString(buffer: string, key: string): string {
  // Try complete string first: "key":"value with \" escapes"
  const completeRe = new RegExp(
    `"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`,
    "m"
  )
  const m1 = buffer.match(completeRe)
  if (m1) return unescapeJsonString(m1[1])

  // Try truncated: "key":"partial value without closing quote
  const partialRe = new RegExp(
    `"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)$`,
    "m"
  )
  const m2 = buffer.match(partialRe)
  if (m2) return unescapeJsonString(m2[1])

  return ""
}

/**
 * Extract a string array (possibly with a truncated final element) for a
 * given key from a partial JSON buffer. Returns the unescaped items joined
 * with newlines (for steps) or blank lines (for paragraphs).
 */
function extractPartialStringArray(
  buffer: string,
  key: string,
  joinWith: string
): string {
  // Slice from `"key":[` to end of buffer, then extract strings
  const startRe = new RegExp(`"${key}"\\s*:\\s*\\[`)
  const startMatch = buffer.match(startRe)
  if (!startMatch) return ""

  const startIdx = startMatch.index! + startMatch[0].length
  const tail = buffer.slice(startIdx)

  // Find the closing `]` if present (complete array)
  // We need to be careful about nested strings. Walk char by char.
  const items: string[] = []
  let i = 0
  let inString = false
  let escape = false
  let current = ""
  let arrayClosed = false

  while (i < tail.length) {
    const ch = tail[i]
    if (escape) {
      current += ch
      escape = false
    } else if (ch === "\\") {
      current += ch
      escape = true
    } else if (ch === '"') {
      inString = !inString
      current += ch
    } else if (!inString && ch === "]") {
      arrayClosed = true
      break
    } else if (!inString && ch === ",") {
      // End of current item
      const trimmed = current.trim()
      if (trimmed.startsWith('"')) {
        const inner = trimmed.slice(1, trimmed.endsWith('"') ? -1 : undefined)
        items.push(unescapeJsonString(inner))
      }
      current = ""
    } else {
      current += ch
    }
    i++
  }

  // Handle the last item (either before `]` or end of buffer)
  const trimmed = current.trim()
  if (trimmed.startsWith('"')) {
    const inner = trimmed.slice(1, !arrayClosed && trimmed.endsWith('"') ? -1 : undefined)
    items.push(unescapeJsonString(inner))
  }

  // For steps, prefix with "1. ", "2. " etc. only if we have a complete
  // array OR more than one item — otherwise just show the raw text.
  if (key === "steps" && (arrayClosed || items.length > 1)) {
    return items.map((s, idx) => `${idx + 1}. ${s}`).join("\n")
  }
  return items.filter(Boolean).join(joinWith)
}

/**
 * Main entry point. Given the accumulated streaming buffer, return text
 * suitable for live display in the chat bubble.
 *
 * - If the buffer parses as complete JSON, returns a formatted plain-text
 *   version (heading, paragraphs/steps, etc. joined with blank lines).
 * - Otherwise, regex-extracts whatever string fragments are already in
 *   the buffer and joins them so the user sees prose appearing in real
 *   time as the model writes.
 * - Returns "" for the very first few tokens (when only structural JSON
 *   syntax has been emitted), so the bubble stays empty briefly until
 *   real content starts.
 */
export function extractDisplayFromStream(buffer: string): string {
  // Quick path: complete JSON
  const complete = tryFormatCompleteJson(buffer)
  if (complete) return complete.display

  // Strip code fence prefix if present
  const cleaned = buffer.replace(/^```(?:json)?\s*/i, "")

  const parts: string[] = []

  const heading = extractPartialString(cleaned, "heading")
  if (heading) parts.push(heading)

  const subheading = extractPartialString(cleaned, "subheading")
  if (subheading) parts.push(subheading)

  const description = extractPartialString(cleaned, "description")
  if (description) parts.push(description)

  // steps and paragraphs are arrays
  const steps = extractPartialStringArray(cleaned, "steps", "\n")
  if (steps) parts.push(steps)

  const paragraphs = extractPartialStringArray(cleaned, "paragraphs", "\n\n")
  if (paragraphs) parts.push(paragraphs)

  const answer = extractPartialString(cleaned, "answer")
  if (answer) parts.push(answer)

  // optionA / optionB are objects with label+text
  const optAText = extractPartialString(cleaned, "optionA")
    || extractPartialString(cleaned, "text") // when partial inside optionA
  // Skip options during streaming — too fiddly to extract reliably from
  // partial JSON with nested objects. They'll snap into place at `done`.

  const question = extractPartialString(cleaned, "question")
  if (question) parts.push(question)

  void optAText // (intentionally unused — see comment above)

  return parts.filter(Boolean).join("\n\n")
}

/**
 * Try to parse the final buffer as structured JSON. Used by the client
 * when the `done` event arrives to extract the structured fields for the
 * polished <AIResponse> render.
 *
 * Mirrors `parseStructuredResponseSafe` from server-side ai-prompt.ts but
 * is safe to call from client code (no Node APIs).
 */
export function tryParseFinalStructured(buffer: string): {
  structured: StructuredAIResponse
  plain: string
} {
  const result = tryFormatCompleteJson(buffer)
  if (result) {
    return { structured: result.structured, plain: result.display }
  }
  // Fallback: clean raw text
  const cleaned = buffer
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim()
  return {
    structured: {},
    plain: cleaned || "I'm sorry, I couldn't generate a response. Please try again.",
  }
}
