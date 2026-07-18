// Sanity test for the AI prompt parser — exercises all 5 responseTypes
// plus a legacy `style` payload to confirm backward-compat.
//
// Run: npx tsx scripts/test-ai-parser.ts

import {
  parseStructuredResponse,
  parseStructuredResponseSafe,
  derivePlainResponse,
  looksLikeJson,
  type StructuredAIResponse,
} from "../src/lib/ai-prompt"

const cases: Array<{
  name: string
  raw: string
  expectResponseType: StructuredAIResponse["responseType"]
  expectHasField: (s: StructuredAIResponse) => boolean
}> = [
  {
    name: "paragraph",
    raw: `{
      "responseType": "paragraph",
      "heading": "Quit only when the math works",
      "paragraphs": [
        "If your side project is making real money, the math is simple. If it is not, the math is harder.",
        "Most founders quit too early on the wrong thing or too late on the right thing. The fix is to set a numerical cutoff before you start.",
        "Upmind has a runway calculator in the dashboard that helps you make this call without the guesswork."
      ]
    }`,
    expectResponseType: "paragraph",
    expectHasField: (s) => !!s.paragraphs?.length,
  },
  {
    name: "steps",
    raw: `{
      "responseType": "steps",
      "heading": "Land your first 100 users",
      "description": "Stop theorizing. Get in front of people who actually feel the pain you solve.",
      "subheading": "The playbook",
      "steps": [
        "Nail down exactly who hurts the most without your solution.",
        "Find the watering holes where those people already hang out.",
        "Reach out directly with a personal message, not a blast.",
        "Set up a simple waitlist so interest has somewhere to go.",
        "Track every conversation so you can follow up when you ship."
      ]
    }`,
    expectResponseType: "steps",
    expectHasField: (s) => !!s.steps?.length,
  },
  {
    name: "quick",
    raw: `{
      "responseType": "quick",
      "heading": "Two to five percent is solid",
      "answer": "A SaaS landing page converting at two to five percent is solid. Anything under one percent means the message or the traffic source is broken."
    }`,
    expectResponseType: "quick",
    expectHasField: (s) => !!s.answer,
  },
  {
    name: "comparison",
    raw: `{
      "responseType": "comparison",
      "heading": "Shopify vs custom storefront",
      "optionA": { "label": "Shopify", "text": "Fast to launch, cheap to run, limited flexibility. Perfect for getting to revenue in days, not months." },
      "optionB": { "label": "Custom build", "text": "Total control, total cost, total time. Worth it only when Shopify actively blocks a core workflow." }
    }`,
    expectResponseType: "comparison",
    expectHasField: (s) => !!s.optionA?.label && !!s.optionB?.label,
  },
  {
    name: "clarify",
    raw: `{
      "responseType": "clarify",
      "heading": "Need more to work with",
      "question": "What does growth look like for you right now, more users, more revenue, or more retention?"
    }`,
    expectResponseType: "clarify",
    expectHasField: (s) => !!s.question,
  },
  {
    name: "legacy style=steps",
    raw: `{
      "style": "steps",
      "heading": "Old playbook",
      "description": "Old description",
      "steps": ["one", "two", "three"]
    }`,
    expectResponseType: undefined,
    expectHasField: (s) => !!s.steps?.length,
  },
  {
    name: "code-fenced paragraph",
    raw: `\`\`\`json
    {
      "responseType": "paragraph",
      "heading": "Fenced",
      "paragraphs": ["First paragraph here."]
    }
    \`\`\``,
    expectResponseType: "paragraph",
    expectHasField: (s) => !!s.paragraphs?.length,
  },
  // Real-world case from the live site: the model emitted slightly
  // malformed JSON with an extra quote+space after the colon. Strict
  // JSON.parse throws, so the regex fallback must salvage the fields.
  {
    name: "malformed clarify (regex fallback)",
    raw: `{"responseType":" "clarify","heading": "Hold Up, What Are We Working With?","question": "What exactly is the business idea you are building and how much runway do you have saved up right now?"}`,
    expectResponseType: "clarify",
    expectHasField: (s) => !!s.question && !!s.heading,
  },
  // Another real-world case: trailing comma after the last field.
  {
    name: "trailing comma (regex fallback)",
    raw: `{"responseType":"quick","heading":"Two to five percent","answer":"Two to five percent is solid.",}`,
    expectResponseType: "quick",
    expectHasField: (s) => !!s.answer,
  },
]

let pass = 0
let fail = 0

for (const c of cases) {
  try {
    // Use the safe wrapper so regex-fallback cases don't throw.
    const { structured: parsed, usedFallback } =
      parseStructuredResponseSafe(c.raw)
    const okType = parsed.responseType === c.expectResponseType
    const okField = c.expectHasField(parsed)
    const plain = derivePlainResponse(parsed)
    const looksJson = looksLikeJson(c.raw)

    if (okType && okField && plain) {
      const fb = usedFallback ? " [regex fallback]" : ""
      console.log(
        `  PASS  ${c.name}${fb}  (plain: "${plain.slice(0, 60)}...")`
      )
      pass++
    } else {
      console.error(`  FAIL  ${c.name}`)
      console.error(
        `        responseType: got ${parsed.responseType}, want ${c.expectResponseType}`
      )
      console.error(`        hasField:     ${okField}`)
      console.error(`        plain:        ${plain ?? "(empty)"}`)
      console.error(`        looksLikeJson: ${looksJson}`)
      fail++
    }
  } catch (e) {
    console.error(`  FAIL  ${c.name}  threw: ${(e as Error).message}`)
    fail++
  }
}

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
