"use client"

import * as React from "react"
import type {
  AIResponseType,
  ComparisonOption,
  StructuredAIResponse,
} from "@/lib/ai-prompt"

/**
 * 5-responseType structured AI response renderer.
 *
 * The AI picks ONE responseType per question, based on what fits best:
 *   1. steps      — numbered step-by-step (sequential how-to)
 *   2. paragraph  — prose paragraphs (opinion / concept / case study / ideas)
 *   3. quick      — one punchy answer (short factual question)
 *   4. comparison — two labeled options side by side (X vs Y)
 *   5. clarify    — heading + clarifying question back to user (vague input)
 *
 * Backward-compat:
 *   - If `responseType` is missing, the component maps the legacy `style`
 *     field (steps / paragraph / quick_take / comparison) to the new
 *     responseType so old chat history still renders sensibly.
 *   - Legacy `left` / `right` comparison objects (with `title` / `items`)
 *     are also tolerated by ComparisonView as a fallback.
 *   - Legacy `description` (used as a single prose block by the old
 *     "paragraph" style) is treated as a one-element paragraph array.
 */

// Re-export the shared types so existing imports from this module still work.
export type { AIResponseType, ComparisonOption, StructuredAIResponse }

interface AIResponseProps {
  data: StructuredAIResponse
  /** Plain text fallback, used when no structured fields are present */
  fallback?: string
}

export function AIResponse({ data, fallback }: AIResponseProps) {
  const hasStructured =
    data.heading ||
    data.description ||
    data.subheading ||
    data.steps?.length ||
    data.paragraphs?.length ||
    data.answer ||
    data.optionA ||
    data.optionB ||
    data.question ||
    // legacy fields
    (data as Record<string, unknown>).left ||
    (data as Record<string, unknown>).right

  if (!hasStructured) {
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {fallback || "I'm sorry, I couldn't generate a response."}
      </div>
    )
  }

  const responseType = resolveResponseType(data)

  switch (responseType) {
    case "steps":
      return <StepsView data={data} />
    case "paragraph":
      return <ParagraphView data={data} />
    case "quick":
      return <QuickView data={data} />
    case "comparison":
      return <ComparisonView data={data} />
    case "clarify":
      return <ClarifyView data={data} />
    default:
      return <ParagraphView data={data} />
  }
}

/**
 * Resolve the effective responseType.
 * Prefers the new `responseType` field; falls back to mapping the legacy
 * `style` field; then infers from whichever payload fields are present;
 * finally defaults to "paragraph" so we never silently default to numbered
 * steps for non-how-to questions.
 */
function resolveResponseType(data: StructuredAIResponse): AIResponseType {
  if (data.responseType) return data.responseType

  const legacy = (data as Record<string, unknown>).style as string | undefined
  switch (legacy) {
    case "steps":
      return "steps"
    case "paragraph":
      return "paragraph"
    case "quick_take":
      return "quick"
    case "comparison":
      return "comparison"
    case "clarify":
      return "clarify"
    default:
      break
  }

  // Infer from payload — handles old saved messages and any case where the
  // model's responseType field didn't parse but the body fields did.
  if (data.question) return "clarify"
  if (data.optionA || data.optionB) return "comparison"
  if (data.answer) return "quick"
  if (data.paragraphs?.length) return "paragraph"
  if (data.steps?.length) return "steps"

  return "paragraph"
}

// ─── StepsView ─────────────────────────────────────────────────────────────────
function StepsView({ data }: { data: StructuredAIResponse }) {
  const steps = data.steps?.length ? data.steps : []
  return (
    <div className="space-y-3">
      {data.heading && (
        <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
          {data.heading}
        </h3>
      )}
      {data.description && (
        <p className="text-sm leading-relaxed text-foreground/90">
          {data.description}
        </p>
      )}
      {data.subheading && steps.length > 0 && (
        <h4 className="text-base font-semibold pt-1">{data.subheading}</h4>
      )}
      {steps.length > 0 && (
        <ol className="space-y-2.5">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3B82F6]/20 dark:bg-[#3B82F6]/15 text-[#1E3A8A] dark:text-[#3B82F6] flex items-center justify-center text-xs font-bold mt-0.5"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="flex-1">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

// ─── ParagraphView ─────────────────────────────────────────────────────────────
function ParagraphView({ data }: { data: StructuredAIResponse }) {
  // Backward-compat: if `paragraphs` is missing but the legacy
  // `description` is present, treat it as a single paragraph. Also split
  // any embedded blank-line-separated chunks just in case.
  const paragraphs = data.paragraphs?.length
    ? data.paragraphs
    : data.description
    ? data.description.split(/\n\n+/).filter(Boolean)
    : []

  return (
    <div className="space-y-2.5">
      {data.heading && (
        <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
          {data.heading}
        </h3>
      )}
      {paragraphs.length > 0 ? (
        paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-foreground/90">
            {p}
          </p>
        ))
      ) : (
        <p className="text-sm leading-relaxed text-foreground/90">
          I&apos;m sorry, I couldn&apos;t generate a response.
        </p>
      )}
    </div>
  )
}

// ─── QuickView ─────────────────────────────────────────────────────────────────
function QuickView({ data }: { data: StructuredAIResponse }) {
  // Backward-compat: legacy quick_take used `subheading` for the punchy line.
  const answer =
    data.answer ||
    data.subheading ||
    data.description
  return (
    <div className="space-y-1.5">
      {data.heading && (
        <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
          {data.heading}
        </h3>
      )}
      {answer && (
        <p className="text-sm leading-relaxed text-foreground/90">{answer}</p>
      )}
    </div>
  )
}

// ─── ComparisonView ────────────────────────────────────────────────────────────
function ComparisonView({ data }: { data: StructuredAIResponse }) {
  // Backward-compat: legacy `left`/`right` had shape { title, items: string[] }.
  // Coerce both new (optionA/optionB with label+text) and legacy into a
  // common { label, text } shape for rendering.
  const optionA = normalizeOption(
    data.optionA,
    (data as Record<string, unknown>).left as
      | { title?: string; items?: string[] }
      | undefined
  )
  const optionB = normalizeOption(
    data.optionB,
    (data as Record<string, unknown>).right as
      | { title?: string; items?: string[] }
      | undefined
  )

  return (
    <div className="space-y-3">
      {data.heading && (
        <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
          {data.heading}
        </h3>
      )}
      {(optionA || optionB) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <ComparisonCard option={optionA} accent="primary" />
          <ComparisonCard option={optionB} accent="neutral" />
        </div>
      )}
    </div>
  )
}

function normalizeOption(
  primary: ComparisonOption | undefined,
  legacy?: { title?: string; items?: string[] }
): ComparisonOption | undefined {
  if (primary?.label || primary?.text) return primary
  if (!legacy) return undefined
  return {
    label: legacy.title,
    text: legacy.items?.join(". "),
  }
}

function ComparisonCard({
  option,
  accent,
}: {
  option?: ComparisonOption
  accent: "primary" | "neutral"
}) {
  if (!option) return null
  const color =
    accent === "primary"
      ? "border-[#3B82F6]/30 bg-[#3B82F6]/5"
      : "border-black/10 dark:border-white/10 bg-muted/40"
  return (
    <div className={`rounded-lg border p-3 ${color}`}>
      {option.label && (
        <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
          {option.label}
        </div>
      )}
      {option.text && (
        <p className="text-sm leading-relaxed text-foreground/90">
          {option.text}
        </p>
      )}
    </div>
  )
}

// ─── ClarifyView ───────────────────────────────────────────────────────────────
function ClarifyView({ data }: { data: StructuredAIResponse }) {
  // Backward-compat: legacy `subheading` was sometimes used for a follow-up
  // question line. Prefer `question` if present.
  const question = data.question || data.subheading
  return (
    <div className="space-y-2.5">
      {data.heading && (
        <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
          {data.heading}
        </h3>
      )}
      {question && (
        <div className="border-l-2 border-[#3B82F6] pl-3 py-1">
          <p className="text-sm leading-relaxed text-foreground/90 italic">
            {question}
          </p>
        </div>
      )}
    </div>
  )
}
