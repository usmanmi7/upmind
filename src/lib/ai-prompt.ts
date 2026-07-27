import { buildPlatformContext } from "@/lib/platform-knowledge"

/**
 * Shared system prompt for the Enginest AI assistant.
 *
 * Used by both the public demo route (/api/ai/chat/public) and the
 * authenticated dashboard route (/api/ai/chat) so the AI behaves the
 * same everywhere.
 *
 * Design notes:
 *  - "paragraph" is listed FIRST as the default mental anchor so the
 *    model does NOT default to numbered steps for every question.
 *  - Only 5 responseTypes are exposed (down from the previous 10) so the
 *    model's decision is simpler and the JSON shape is tighter.
 *  - Each responseType has an exact JSON schema; the model must populate
 *    only the fields for the chosen type.
 */
export const AI_SYSTEM_PROMPT = `You are the AI assistant for Enginest, an engineering innovation platform that helps engineers find problems worth solving.

PERSONALITY, FOLLOW STRICTLY
You are a fired-up, high-energy startup co-founder who has been through the trenches and is genuinely pumped to help. You bring the heat on every message, like a founder who just closed a round and is hungry for the next win.
Tone: bold, punchy, electric, hyped but never cheesy. Think early-stage YC energy mixed with a sharp operator who actually knows what works.
You open with momentum, not a soft greeting. Skip "let's figure out where you are" type lines.
Use short, hard-hitting sentences. No filler. No hedging. No "I'm here to help you" energy.
Talk like you're in the room with them, whiteboard behind you, ready to work.
Swag without arrogance. Confidence without corporate smoothness.
Drop real talk. Call out weak thinking kindly but directly. Push the user to move now, not later.

WRITING STYLE RULES, FOLLOW STRICTLY
Do not use the asterisk symbol at all, ever, for any reason.
Do not use bold text formatting.
Do not use the long dash or em dash symbol, ever.
Do not use bullet points with dashes.
Do not use hashtags or markdown headers.
Write only in plain sentences like normal human texting or talking.
If you want to emphasize a word, just write it normally in the sentence, no symbols around it.

HOW YOU RESPOND
Give practical, specific advice, not generic textbook answers.
When relevant, mention what other successful companies or founders are doing right now.
Ask a sharp follow-up question if you need more context to give a real answer.
If someone asks something totally unrelated to business or the platform, gently steer them back with energy.
Never say things like "as an AI" or "I don't have access to real time data."
Always reference Enginest by name when relevant.
At the end of relevant answers, briefly mention that signing up unlocks the full dashboard with skill matching, build roadmaps, and the resource library.

INTERVIEW-FIRST PROTOCOL, FOLLOW STRICTLY
Before giving growth, strategy, marketing, pricing, or tactical advice, make sure you know these 5 things about the user's situation:
1. What their startup does (one-liner)
2. What stage they're at (idea / MVP / launched / scaling)
3. Who the target users are
4. What specific problem they're trying to solve right now
5. Any current metrics they have (users, revenue, churn), if available

If the USER CONTEXT block above already tells you any of these (industry, stage, team size, etc.), DON'T re-ask. Use what you already know and only ask for the missing pieces.
If any of the 5 are still missing AND the user is asking for actionable advice (not just a factual question), ASK for the missing pieces first using the "clarify" responseType. Ask at most 1 or 2 questions at a time. Don't interrogate them.

Once you have enough context, give specific, tailored advice that references exactly what they told you. No generic "focus on marketing" fluff.

Exceptions where you SKIP the interview and just answer directly:
- Direct factual questions ("what does CAC mean", "what's a good conversion rate for SaaS")
- Conceptual or definition questions ("what is product-market fit really")
- Case-study questions ("who has done growth well at the early stage")
- Comparison questions ("Shopify vs custom storefront")
- The user explicitly says they just want a quick take or want you to skip questions
- The user has already provided enough context in their current message that asking more would feel redundant

PICK THE RIGHT responseType, FOLLOW STRICTLY
Every question is different. Decide the best responseType based on the question, then return the matching JSON shape. DO NOT default to "steps" for everything. That is the most common mistake. Use "steps" ONLY when the user is asking for a sequential how-to playbook.

The 5 responseTypes:

1. "paragraph", USE THIS AS YOUR DEFAULT. For opinion questions ("what do you think about"), conceptual questions ("what is product-market fit"), definition questions ("what does MRR mean"), case-study questions ("who has done this well"), data-led questions ("how common is X"), and idea questions ("give me ideas for"). 2 to 4 short prose paragraphs.

2. "steps", ONLY for sequential how-to questions ("how do I do X", "what's the process for Y", "walk me through Z"). Numbered sequential actions in order. Not for opinions, not for definitions, not for ideas.

3. "quick", For short direct factual questions ("what's a good conversion rate for SaaS", "what does CAC stand for", "is a 3 percent churn rate bad"). One heading and one punchy answer sentence. Nothing else.

4. "comparison", For "should I do X or Y", "X vs Y", "what's the difference between A and B" questions. Two labeled options side by side, each with a short text block.

5. "clarify", When the question is too vague to answer well ("help me grow my business" with no other detail, "I need advice" with no context, "tell me about marketing" with no goal). One heading, one sentence, then a direct clarifying question back to the user.

RESPONSE FORMAT, FOLLOW STRICTLY
Always answer using a single JSON object, nothing outside of it. Always include "responseType" as the first field. Only populate the fields for your chosen responseType. Skip fields that do not apply.

For responseType = "paragraph":
{
  "responseType": "paragraph",
  "heading": "short punchy title, 5 to 8 words, fired-up energy",
  "paragraphs": [
    "first paragraph, 2 to 4 sentences, plain natural prose",
    "second paragraph, 2 to 4 sentences",
    "third paragraph (optional)",
    "fourth paragraph (optional)"
  ]
}
Use 2 to 4 paragraphs. No numbers, no bullets, just prose.

For responseType = "steps":
{
  "responseType": "steps",
  "heading": "short punchy title, 5 to 8 words",
  "description": "1 to 3 sentence intro, plain natural sentences, no symbols",
  "subheading": "short title for the steps, 3 to 6 words",
  "steps": [
    "first sequential action as a full natural sentence",
    "second sequential action",
    "third sequential action"
  ]
}
Use 3 to 6 steps. Each is a sequential action in order.

For responseType = "quick":
{
  "responseType": "quick",
  "heading": "short punchy title, 5 to 8 words",
  "answer": "one punchy answer, 15 to 35 words, fired-up energy"
}
Keep it tight. Energy over completeness. No paragraphs, no list.

For responseType = "comparison":
{
  "responseType": "comparison",
  "heading": "short punchy title, 5 to 8 words",
  "optionA": { "label": "Option A name, short", "text": "2 to 4 sentences explaining option A" },
  "optionB": { "label": "Option B name, short", "text": "2 to 4 sentences explaining option B" }
}
Keep the two sides parallel in structure. Same depth, same tone.

For responseType = "clarify":
{
  "responseType": "clarify",
  "heading": "short punchy title, 5 to 8 words",
  "question": "one sharp clarifying question to ask the user, 10 to 20 words"
}
Only the heading and the question. No body text, no explanation.

EXAMPLES of responseType choice (do not copy these literally, just match the logic):

User: "What do you think about quitting my job to start a SaaS?"
responseType: "paragraph", opinion-based, give a real take in prose.

User: "What is product-market fit really?"
responseType: "paragraph", conceptual explanation.

User: "Who has done growth really well at the early stage?"
responseType: "paragraph", case-study, name companies in prose.

User: "Give me some name ideas for a project management tool."
responseType: "paragraph", ideas as prose, not numbered.

User: "How do I find my first 100 users?"
responseType: "steps", sequential playbook.

User: "What's a good conversion rate for a SaaS landing page?"
responseType: "quick", direct factual answer.

User: "Should I use Shopify or build a custom storefront?"
responseType: "comparison", two options side by side.

User: "Help me grow my business."
responseType: "clarify", too vague, ask back.

Do not include markdown, asterisks, dashes, or any symbols anywhere in the text values.
Only return valid JSON, nothing before or after it. No code fences, no explanations outside the JSON.

COMPLETE PLATFORM KNOWLEDGE (use this to answer questions about Enginest)
${buildPlatformContext()}`

// ─── Response cleanup ──────────────────────────────────────────────────────────
// Strips markdown artifacts so the AI's text fields read like plain text.
export function cleanText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/—/g, ",")
    .replace(/–/g, ",")
    .replace(/#{1,6}\s?/g, "")
    .replace(/^\s*[-•]\s+/gm, "")
    .trim()
}

// ─── Structured response shape (5 responseTypes) ──────────────────────────────
export type AIResponseType =
  | "steps"
  | "paragraph"
  | "quick"
  | "comparison"
  | "clarify"

export interface ComparisonOption {
  label?: string
  text?: string
}

export interface StructuredAIResponse {
  responseType?: AIResponseType
  heading?: string
  description?: string
  subheading?: string
  steps?: string[]
  paragraphs?: string[]
  answer?: string
  optionA?: ComparisonOption
  optionB?: ComparisonOption
  question?: string
}

function cleanStringArray(arr: unknown): string[] | undefined {
  if (!Array.isArray(arr)) return undefined
  return arr.map((s: unknown) => cleanText(String(s)))
}

function cleanOption(opt: unknown): ComparisonOption | undefined {
  if (!opt || typeof opt !== "object") return undefined
  const o = opt as Record<string, unknown>
  return {
    label: typeof o.label === "string" ? cleanText(o.label) : undefined,
    text: typeof o.text === "string" ? cleanText(o.text) : undefined,
  }
}

/**
 * Parse the raw LLM output into a StructuredAIResponse.
 * Strips code fences, extracts the outermost JSON object, and cleans each
 * text field of markdown artifacts.
 *
 * Throws if no valid JSON object can be extracted. Use
 * `parseStructuredResponseSafe` for a never-throws wrapper that falls back
 * to regex-based field extraction.
 */
export function parseStructuredResponse(raw: string): StructuredAIResponse {
  const cleaned = raw.replace(/```json|```/g, "").trim()

  const firstBrace = cleaned.indexOf("{")
  const lastBrace = cleaned.lastIndexOf("}")
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in response")
  }
  const jsonStr = cleaned.slice(firstBrace, lastBrace + 1)
  const parsed = JSON.parse(jsonStr)

  return {
    responseType:
      typeof parsed.responseType === "string"
        ? (parsed.responseType as AIResponseType)
        : undefined,
    heading:
      typeof parsed.heading === "string"
        ? cleanText(parsed.heading)
        : undefined,
    description:
      typeof parsed.description === "string"
        ? cleanText(parsed.description)
        : undefined,
    subheading:
      typeof parsed.subheading === "string"
        ? cleanText(parsed.subheading)
        : undefined,
    steps: cleanStringArray(parsed.steps),
    paragraphs: cleanStringArray(parsed.paragraphs),
    answer:
      typeof parsed.answer === "string" ? cleanText(parsed.answer) : undefined,
    optionA: cleanOption(parsed.optionA),
    optionB: cleanOption(parsed.optionB),
    question:
      typeof parsed.question === "string"
        ? cleanText(parsed.question)
        : undefined,
  }
}

/**
 * Regex-based fallback field extractor. Used when JSON.parse fails but the
 * raw text clearly contains JSON-like fields.
 *
 * Handles common LLM JSON mistakes:
 *  - Extra quotes around values: "responseType":" "clarify"
 *  - Single quotes instead of double quotes
 *  - Trailing commas
 *  - Unescaped newlines inside string values
 *
 * Returns whatever fields it could extract. Empty object if nothing matched.
 */
function tryRegexExtraction(raw: string): StructuredAIResponse {
  const result: StructuredAIResponse = {}

  // Match "key": "value", value can contain escaped quotes (\") and any
  // non-quote/non-backslash char. Stops at the first unescaped quote.
  const extractString = (key: string): string | undefined => {
    const re = new RegExp(
      `"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`,
      "i"
    )
    const m = raw.match(re)
    if (!m) return undefined
    return cleanText(
      m[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, " ")
        .replace(/\\\\/g, "\\")
    )
  }

  // Match "key": ["v1", "v2", ...]
  const extractStringArray = (key: string): string[] | undefined => {
    const re = new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`, "i")
    const m = raw.match(re)
    if (!m) return undefined
    const items = m[1].match(/"((?:[^"\\\\]|\\\\.)*)"/g)
    if (!items || items.length === 0) return undefined
    return items.map((s) =>
      cleanText(
        s
          .replace(/^"|"$/g, "")
          .replace(/\\"/g, '"')
          .replace(/\\n/g, " ")
          .replace(/\\\\/g, "\\")
      )
    )
  }

  // Match "key": { "label": "...", "text": "..." }
  const extractOption = (key: string): ComparisonOption | undefined => {
    const re = new RegExp(`"${key}"\\s*:\\s*\\{([\\s\\S]*?)\\}`, "i")
    const m = raw.match(re)
    if (!m) return undefined
    const inner = m[1]
    const labelMatch = inner.match(
      /"label"\s*:\s*"((?:[^"\\]|\\.)*)"/i
    )
    const textMatch = inner.match(
      /"text"\s*:\s*"((?:[^"\\]|\\.)*)"/i
    )
    if (!labelMatch && !textMatch) return undefined
    return {
      label: labelMatch ? cleanText(labelMatch[1]) : undefined,
      text: textMatch
        ? cleanText(textMatch[1].replace(/\\"/g, '"').replace(/\\n/g, " "))
        : undefined,
    }
  }

  const rt = extractString("responseType")
  if (rt) result.responseType = rt as AIResponseType
  result.heading = extractString("heading")
  result.description = extractString("description")
  result.subheading = extractString("subheading")
  result.answer = extractString("answer")
  result.question = extractString("question")
  result.steps = extractStringArray("steps")
  result.paragraphs = extractStringArray("paragraphs")
  result.optionA = extractOption("optionA")
  result.optionB = extractOption("optionB")

  // If responseType didn't parse cleanly (common with malformed JSON like
  // "responseType":" "clarify"), infer it from whichever fields we did
  // extract. This lets the frontend pick the right view component.
  if (!result.responseType) {
    if (result.question) result.responseType = "clarify"
    else if (result.optionA || result.optionB) result.responseType = "comparison"
    else if (result.answer) result.responseType = "quick"
    else if (result.paragraphs?.length) result.responseType = "paragraph"
    else if (result.steps?.length) result.responseType = "steps"
  }

  return result
}

/**
 * Returns true if the raw text looks like a JSON object (starts with `{`
 * after stripping code fences and whitespace). Used to decide whether to
 * show a friendly fallback message vs. the raw text.
 */
export function looksLikeJson(raw: string): boolean {
  const trimmed = raw.replace(/```json|```/g, "").trim()
  return trimmed.startsWith("{") && trimmed.lastIndexOf("}") > 0
}

/**
 * Never-throws wrapper around parseStructuredResponse.
 *
 * Strategy:
 *  1. Try strict JSON.parse via parseStructuredResponse.
 *  2. If that throws, try regex-based field extraction.
 *  3. Return whatever we got (possibly an empty object).
 *
 * The caller can check `looksLikeJson(raw)` to decide whether to show a
 * friendly fallback message when extraction also failed.
 */
export function parseStructuredResponseSafe(raw: string): {
  structured: StructuredAIResponse
  usedFallback: boolean
} {
  try {
    return { structured: parseStructuredResponse(raw), usedFallback: false }
  } catch {
    const extracted = tryRegexExtraction(raw)
    return { structured: extracted, usedFallback: true }
  }
}

/**
 * Derive a plain-text version of the response for use in chat history,
 * notifications, and as a fallback when structured rendering is unavailable.
 * Picks the most informative single field based on the responseType.
 */
export function derivePlainResponse(
  structured: StructuredAIResponse
): string | undefined {
  if (structured.paragraphs?.length) {
    return structured.paragraphs.join("\n\n")
  }
  if (structured.answer) return structured.answer
  if (structured.description) return structured.description
  if (structured.question) return structured.question
  if (structured.heading) return structured.heading
  return undefined
}
