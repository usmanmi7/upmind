"use client"

import * as React from "react"
import {
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Quote,
  Layers,
  ArrowRight,
  Building2,
} from "lucide-react"

/**
 * Multi-style structured AI response renderer.
 *
 * The AI picks ONE of 10 styles per question, based on what fits best:
 *   1. steps        — numbered step-by-step (how-to)
 *   2. paragraph    — prose paragraphs (concept / explanation)
 *   3. quick_take   — short punchy opinion
 *   4. checklist    — actionable bullets with checkmarks
 *   5. comparison   — two-sided comparison (X vs Y)
 *   6. pros_cons    — pros vs cons list
 *   7. examples     — real company / founder examples
 *   8. qa           — multi-part Q&A
 *   9. pitfalls     — common mistakes + fixes
 *  10. timeline     — phased rollout plan
 *
 * Backward-compat: if `style` is missing but `steps` is present, renders as
 * the old steps layout (treats it as "steps").
 */

export type AIResponseStyle =
  | "steps"
  | "paragraph"
  | "quick_take"
  | "checklist"
  | "comparison"
  | "pros_cons"
  | "examples"
  | "qa"
  | "pitfalls"
  | "timeline"

export interface ComparisonSide {
  title?: string
  items?: string[]
}

export interface ExampleItem {
  company?: string
  takeaway?: string
}

export interface QAItem {
  q?: string
  a?: string
}

export interface PitfallItem {
  mistake?: string
  fix?: string
}

export interface PhaseItem {
  name?: string
  actions?: string[]
}

export interface StructuredAIResponse {
  style?: AIResponseStyle
  heading?: string
  description?: string
  subheading?: string
  // generic array used by steps / checklist
  steps?: string[]
  // comparison style
  left?: ComparisonSide
  right?: ComparisonSide
  // pros_cons style
  pros?: string[]
  cons?: string[]
  // examples style
  examples?: ExampleItem[]
  // qa style
  qa?: QAItem[]
  // pitfalls style
  pitfalls?: PitfallItem[]
  // timeline style
  phases?: PhaseItem[]
}

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
    data.left?.items?.length ||
    data.right?.items?.length ||
    data.pros?.length ||
    data.cons?.length ||
    data.examples?.length ||
    data.qa?.length ||
    data.pitfalls?.length ||
    data.phases?.length

  if (!hasStructured) {
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {fallback || "I'm sorry, I couldn't generate a response."}
      </div>
    )
  }

  // Backward-compat: no style → treat as steps
  const style: AIResponseStyle = data.style || "steps"

  return (
    <div className="space-y-3">
      {data.heading && (
        <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
          {data.heading}
        </h3>
      )}

      {data.description && style !== "paragraph" && (
        <p className="text-sm leading-relaxed text-foreground/90">{data.description}</p>
      )}

      {style === "paragraph" && data.description && (
        <div className="space-y-2">
          {data.description
            .split(/\n\n+/)
            .filter(Boolean)
            .map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
        </div>
      )}

      {style === "quick_take" && (
        <div className="border-l-2 border-[#7CFC00] pl-3 py-1">
          <p className="text-sm leading-relaxed text-foreground/90 italic">
            {data.subheading || data.description}
          </p>
        </div>
      )}

      {data.subheading &&
        (style === "steps" || style === "checklist" || style === "pitfalls") &&
        data.steps?.length ? (
          <h4 className="text-base font-semibold pt-1">{data.subheading}</h4>
        ) : null}

      {/* 1. STEPS — numbered list */}
      {style === "steps" && data.steps && data.steps.length > 0 && (
        <ol className="space-y-2.5">
          {data.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
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

      {/* 4. CHECKLIST — actionable bullets with check icons */}
      {style === "checklist" && data.steps && data.steps.length > 0 && (
        <ul className="space-y-2">
          {data.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-md bg-[#7CFC00] text-[#1A2E1A] flex items-center justify-center mt-0.5"
                aria-hidden="true"
              >
                <Check className="size-3" />
              </span>
              <span className="flex-1">{step}</span>
            </li>
          ))}
        </ul>
      )}

      {/* 5. COMPARISON — two-column X vs Y */}
      {style === "comparison" && (data.left?.items?.length || data.right?.items?.length) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <ComparisonCol side={data.left} accent="left" />
          <ComparisonCol side={data.right} accent="right" />
        </div>
      )}

      {/* 6. PROS_CONS — pros vs cons */}
      {style === "pros_cons" && (data.pros?.length || data.cons?.length) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg border border-[#7CFC00]/30 bg-[#7CFC00]/5 p-3">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-[#2D4A2D] dark:text-[#7CFC00]">
              <Check className="size-3.5" /> Pros
            </div>
            <ul className="space-y-1.5">
              {(data.pros || []).map((p, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <Check className="size-3.5 mt-0.5 shrink-0 text-[#7CFC00]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
              <X className="size-3.5" /> Cons
            </div>
            <ul className="space-y-1.5">
              {(data.cons || []).map((c, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <X className="size-3.5 mt-0.5 shrink-0 text-red-500" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 7. EXAMPLES — real company examples */}
      {style === "examples" && data.examples && data.examples.length > 0 && (
        <div className="space-y-2 pt-1">
          {data.examples.map((ex, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg bg-muted/40 border border-black/5 dark:border-white/5"
            >
              <div className="size-8 rounded-md bg-[#7CFC00]/15 text-[#2D4A2D] dark:text-[#7CFC00] grid place-items-center shrink-0">
                <Building2 className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                {ex.company && (
                  <div className="text-sm font-semibold leading-tight">{ex.company}</div>
                )}
                {ex.takeaway && (
                  <div className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                    {ex.takeaway}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 8. QA — multi-part question/answer pairs */}
      {style === "qa" && data.qa && data.qa.length > 0 && (
        <div className="space-y-3 pt-1">
          {data.qa.map((pair, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex gap-2 text-sm font-semibold">
                <span className="text-[#7CFC00]">Q{i + 1}.</span>
                <span>{pair.q}</span>
              </div>
              <div className="flex gap-2 text-sm leading-relaxed text-muted-foreground pl-5">
                <span className="text-[#7CFC00]/70 shrink-0">A.</span>
                <span>{pair.a}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 9. PITFALLS — common mistakes + fixes */}
      {style === "pitfalls" && data.pitfalls && data.pitfalls.length > 0 && (
        <div className="space-y-2.5 pt-1">
          {data.pitfalls.map((p, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-300/40 dark:border-amber-700/40 bg-amber-50/60 dark:bg-amber-950/20 p-3"
            >
              <div className="flex items-start gap-2 text-sm font-medium">
                <AlertTriangle className="size-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{p.mistake}</span>
              </div>
              {p.fix && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1.5 pl-6">
                  <ArrowRight className="size-3.5 mt-0.5 shrink-0 text-[#7CFC00]" />
                  <span>
                    <span className="font-medium text-foreground">Fix:</span> {p.fix}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 10. TIMELINE — phased rollout plan */}
      {style === "timeline" && data.phases && data.phases.length > 0 && (
        <div className="relative pt-2 pl-2">
          <div
            className="absolute left-[1.05rem] top-3 bottom-3 w-px bg-black/10 dark:bg-white/10"
            aria-hidden="true"
          />
          <ol className="space-y-4">
            {data.phases.map((phase, i) => (
              <li key={i} className="relative pl-8">
                <span
                  className="absolute left-0 top-0.5 size-5 rounded-full bg-[#7CFC00] text-[#1A2E1A] grid place-items-center text-[10px] font-bold ring-4 ring-background"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {phase.name && (
                  <div className="text-sm font-semibold leading-tight">{phase.name}</div>
                )}
                {phase.actions && phase.actions.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {phase.actions.map((a, j) => (
                      <li
                        key={j}
                        className="text-sm leading-relaxed text-muted-foreground flex gap-2"
                      >
                        <span className="text-[#7CFC00] shrink-0">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ComparisonCol({
  side,
  accent,
}: {
  side?: ComparisonSide
  accent: "left" | "right"
}) {
  if (!side) return null
  const color =
    accent === "left"
      ? "border-[#7CFC00]/30 bg-[#7CFC00]/5 text-[#2D4A2D] dark:text-[#7CFC00]"
      : "border-black/10 dark:border-white/10 bg-muted/40 text-foreground"
  return (
    <div className={`rounded-lg border p-3 ${color}`}>
      {side.title && (
        <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
          {side.title}
        </div>
      )}
      <ul className="space-y-1.5">
        {(side.items || []).map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="shrink-0 opacity-60">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Mark unused-import-proof helpers (keeps the icons imported above in use
// even when certain styles never render in a given response).
void Sparkles
void Quote
void Layers
