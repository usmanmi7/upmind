// Sanity tests for the AI context + history helpers.
//
// Run: npx tsx scripts/test-ai-context.ts

import {
  trimHistoryWithSummary,
  buildReopenSummary,
  renderUserContext,
  MESSAGE_CAP,
  SUMMARY_TRIGGER,
  type UserContext,
} from "../src/lib/ai-context"

let pass = 0
let fail = 0

function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    console.log(`  PASS  ${name}`)
    pass++
  } else {
    console.error(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`)
    fail++
  }
}

// ─── trimHistoryWithSummary ───────────────────────────────────────────────────

console.log("\ntrimHistoryWithSummary:")

// Short history — no summary needed, just cap at MESSAGE_CAP.
{
  const history = [
    { role: "user", content: "hi" },
    { role: "assistant", content: "hello" },
  ]
  const out = trimHistoryWithSummary(history)
  check(
    "short history returns as-is",
    out.length === 2 && out[0].role === "user",
    `got length ${out.length}`
  )
}

// Long history — should produce a summary prefix + recent messages.
{
  const history: Array<{ role: string; content: string }> = []
  for (let i = 0; i < SUMMARY_TRIGGER + 5; i++) {
    history.push({ role: "user", content: `Question ${i}` })
    history.push({
      role: "assistant",
      content: JSON.stringify({ responseType: "quick", heading: `Answer ${i}`, answer: `Reply ${i}` }),
    })
  }
  // 17 messages total (12 trigger + 5 extra pairs would be 34; let's just say length > trigger)
  const out = trimHistoryWithSummary(history)
  const hasSummary = out[0]?.role === "system" && out[0].content.includes("EARLIER CONVERSATION SUMMARY")
  check(
    "long history starts with summary system message",
    hasSummary,
    `first role: ${out[0]?.role}, content starts: ${out[0]?.content?.slice(0, 40)}`
  )
  check(
    "long history keeps recent messages verbatim",
    out.length === MESSAGE_CAP + 1, // +1 for the summary
    `got length ${out.length}`
  )
  check(
    "summary references the user's questions",
    out[0].content.includes("Question 0"),
    "summary should mention early questions"
  )
  check(
    "summary references the AI's headings",
    out[0].content.includes("Answer 0"),
    "summary should mention early AI headings"
  )
}

// History with malformed assistant JSON — summarizer should fall back to
// first-sentence extraction, not throw.
{
  const history: Array<{ role: string; content: string }> = []
  for (let i = 0; i < SUMMARY_TRIGGER + 2; i++) {
    history.push({ role: "user", content: `Question ${i}` })
    history.push({
      role: "assistant",
      content: `This is a plain text reply without JSON formatting. Number ${i}.`,
    })
  }
  const out = trimHistoryWithSummary(history)
  check(
    "malformed assistant content doesn't crash summarizer",
    out[0]?.role === "system" && out[0].content.includes("EARLIER CONVERSATION SUMMARY"),
    `first role: ${out[0]?.role}`
  )
  check(
    "summary falls back to first-sentence extraction",
    out[0].content.includes("AI replied"),
    `content: ${out[0].content.slice(0, 200)}`
  )
}

// ─── buildReopenSummary ───────────────────────────────────────────────────────

console.log("\nbuildReopenSummary:")

{
  const out = buildReopenSummary([])
  check("empty messages returns null", out === null)
}

{
  const out = buildReopenSummary([{ role: "user", content: "hi" }])
  // A single user message with no AI reply still produces a "last you asked"
  // summary — that's useful context for the user when reopening.
  check(
    "single user message returns summary with that question",
    out !== null && out.includes("hi"),
    `got: ${out}`
  )
}

{
  const out = buildReopenSummary([
    { role: "user", content: "How do I find my first 100 users?" },
    {
      role: "assistant",
      content: JSON.stringify({
        responseType: "steps",
        heading: "Land your first 100 users",
        steps: ["a", "b"],
      }),
    },
  ])
  check(
    "returns summary with user question + AI heading",
    out !== null &&
      out.includes("How do I find my first 100 users") &&
      out.includes("Land your first 100 users"),
    `got: ${out}`
  )
}

{
  const out = buildReopenSummary([
    { role: "user", content: "What is burn rate?" },
    {
      role: "assistant",
      content: "Burn rate is the rate at which a startup spends money.",
    },
  ])
  check(
    "non-JSON assistant reply uses first-sentence fallback",
    out !== null && out.includes("burn rate"),
    `got: ${out}`
  )
}

{
  const longQuestion = "A".repeat(500)
  const out = buildReopenSummary([
    { role: "user", content: longQuestion },
    { role: "assistant", content: JSON.stringify({ heading: "Short answer" }) },
  ])
  check(
    "long user question gets truncated",
    out !== null && out.length < 300,
    `got length ${out?.length}`
  )
}

// ─── renderUserContext ────────────────────────────────────────────────────────

console.log("\nrenderUserContext:")

{
  const out = renderUserContext(null)
  check("null context returns empty string", out === "")
}

{
  const ctx: UserContext = {
    name: "Sara",
    email: "sara@example.com",
    role: "PAID_USER",
    country: "Singapore",
    plan: "GROWTH_PRO",
    subscriptionStatus: "ACTIVE",
    startup: {
      name: "Acme",
      industry: "fintech",
      businessStage: "Pre-seed",
      revenueStage: "Pre-revenue",
      teamSize: "4",
      progress: 35,
    },
    roadmap: {
      completedCount: 2,
      totalCount: 8,
      currentPhase: "Validation",
      recentItems: [
        { title: "Customer interviews", phase: "Validation", isCompleted: true },
        { title: "MVP build", phase: "Build", isCompleted: false },
      ],
    },
    recentChatTopic: "Pricing strategy",
  }
  const out = renderUserContext(ctx)
  check("includes user name", out.includes("Sara"))
  check("includes startup name", out.includes("Acme"))
  check("includes industry", out.includes("fintech"))
  check("includes business stage", out.includes("Pre-seed"))
  check("includes plan", out.includes("GROWTH_PRO"))
  check("includes roadmap progress", out.includes("2/8") && out.includes("Validation"))
  check("includes recent chat topic", out.includes("Pricing strategy"))
  check("includes personalization instructions", out.includes("Address the user by their first name"))
}

{
  // User with no startup yet — should encourage setup
  const ctx: UserContext = {
    name: "Jordan",
    email: "jordan@example.com",
    role: "FREE_USER",
  }
  const out = renderUserContext(ctx)
  check(
    "missing startup triggers encouragement",
    out.includes("not yet set up") && out.includes("complete their startup profile"),
    out
  )
}

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
