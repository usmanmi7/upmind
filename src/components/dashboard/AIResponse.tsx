"use client"

import * as React from "react"

/**
 * Renders a structured AI response (heading / description / subheading / steps)
 * with proper visual styling, instead of dumping plain text.
 *
 * Used by:
 *   - /src/components/dashboard/GlmSearchBar.tsx (bottom search bar chat)
 *   - /src/app/dashboard/ai-assistant/page.tsx (dedicated AI assistant page)
 *
 * If no structured fields are present (e.g. error fallback, or model broke
 * JSON format), falls back to rendering the plain `response` text.
 *
 * Typography is sized for chat-bubble context (not 52px hero text), so it
 * feels natural inside a chat window while still giving visual hierarchy.
 */

export interface StructuredAIResponse {
  heading?: string
  description?: string
  subheading?: string
  steps?: string[]
}

interface AIResponseProps {
  data: StructuredAIResponse
  /** Plain text fallback, used when no structured fields are present */
  fallback?: string
}

export function AIResponse({ data, fallback }: AIResponseProps) {
  const hasStructured =
    data.heading || data.description || data.subheading || data.steps?.length

  if (!hasStructured) {
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {fallback || "I'm sorry, I couldn't generate a response."}
      </div>
    )
  }

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

      {data.subheading && data.steps && data.steps.length > 0 && (
        <h4 className="text-base font-semibold pt-1">{data.subheading}</h4>
      )}

      {data.steps && data.steps.length > 0 && (
        <ol className="space-y-2.5">
          {data.steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed"
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7CFC00]/20 dark:bg-[#7CFC00]/15 text-[#2D4A2D] dark:text-[#7CFC00] flex items-center justify-center text-xs font-bold mt-0.5"
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
