/**
 * Smoke test for the streaming JSON display extractor.
 *
 * Simulates the buffer growing as tokens arrive from the LLM, and
 * verifies that at every step we get sensible display text (not raw
 * JSON syntax showing through).
 *
 * Run: npx tsx scripts/test-stream-display.ts
 */
import { extractDisplayFromStream } from "../src/lib/ai-stream-display"

// A realistic GLM-5.2 "paragraph" response, split into chunks that
// mimic how the model emits tokens (a few chars at a time, breaking
// at arbitrary points — sometimes mid-key, sometimes mid-string-value).
const fullResponse = `{"responseType":"paragraph","heading":"Build something people actually want","paragraphs":["First, stop guessing. Talk to ten real users this week and ask what they hate about their current workflow.","Second, ship the smallest version that solves that exact pain. Not a demo. Not a landing page. A thing they use."]}`

// Simulate streaming in ~10-char chunks
const chunks: string[] = []
for (let i = 0; i < fullResponse.length; i += 10) {
  chunks.push(fullResponse.slice(i, i + 10))
}

console.log(`Simulating ${chunks.length} chunks of ~10 chars each\n`)
console.log("─".repeat(60))

let buffer = ""
const snapshots: { step: number; display: string }[] = []
chunks.forEach((chunk, i) => {
  buffer += chunk
  const display = extractDisplayFromStream(buffer)
  // Only log every 5th step to keep output readable
  if (i % 5 === 0 || i === chunks.length - 1) {
    snapshots.push({ step: i, display })
    console.log(`Step ${i.toString().padStart(3)}: ${display.slice(0, 80)}${display.length > 80 ? "…" : ""}`)
  }
})

console.log("\n" + "─".repeat(60))
console.log("FINAL display:\n")
const finalDisplay = extractDisplayFromStream(buffer)
console.log(finalDisplay)

// ─── Assertions ────────────────────────────────────────────────────
const failures: string[] = []

// 1. The final display should NOT contain any JSON syntax
const jsonSyntax = [/^\{/, /\}$/, /"responseType"/, /"heading":/, /"paragraphs":/]
for (const re of jsonSyntax) {
  if (re.test(finalDisplay)) {
    failures.push(`Final display contains JSON syntax: ${re}`)
  }
}

// 2. The final display should contain the actual content
const expectedSubstrings = [
  "Build something people actually want",
  "First, stop guessing.",
  "Second, ship the smallest version",
]
for (const s of expectedSubstrings) {
  if (!finalDisplay.includes(s)) {
    failures.push(`Final display missing expected substring: "${s}"`)
  }
}

// 3. Early steps (step 0-5) should NOT show JSON syntax like `{"responseType":"par`
//    to the user — the helper should return "" until there's actual content.
const earlySnapshot = snapshots[1] // step 5
if (earlySnapshot && earlySnapshot.display.includes('"responseType"')) {
  failures.push(`Early snapshot (step 5) shows raw JSON syntax: "${earlySnapshot.display}"`)
}

console.log("\n" + "─".repeat(60))
if (failures.length === 0) {
  console.log("✓ All assertions passed!")
  process.exit(0)
} else {
  console.log(`✗ ${failures.length} assertion(s) failed:`)
  failures.forEach((f) => console.log(`  - ${f}`))
  process.exit(1)
}
