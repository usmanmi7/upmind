// Quick sanity check for getNVIDIAModelLabel behavior
// Run: node /home/z/my-project/scripts/test_label.cjs

function getLabel(raw) {
  const withoutOrg = raw.split("/").pop() || raw
  const protectedVersion = withoutOrg.replace(/\.(\d)/g, "\u0001$1")
  let cleaned = protectedVersion
    .replace(/-chat$/i, "")
    .replace(/-it$/i, "")
    .replace(/-/g, " ")
    .replace(/\b(\d+b)\b/gi, (m) => m.toUpperCase())
    .replace(/\bglm\b/i, "GLM")
    .replace(/\bgemma\b/i, "Gemma")
    .replace(/\bllama\b/i, "Llama")
    .replace(/\bmistral\b/i, "Mistral")
  cleaned = cleaned
    .replace(/\u0001/g, ".")
    .replace(/(GLM|Gemma|Llama|Mistral)\s+(\d+\.\d+)/i, "$1-$2")
  return cleaned
}

const cases = [
  ["z-ai/glm-5.2", "GLM-5.2"],
  ["thudm/glm-4-9b-chat", "GLM-4 9B"],
  ["google/gemma-3-12b-it", "Gemma 3 12B"],
  ["meta/llama-3.1-70b-instruct", "Llama-3.1 70B"],
]

let pass = 0
for (const [input, expected] of cases) {
  const got = getLabel(input)
  const ok = got === expected
  if (ok) pass++
  console.log(`${ok ? "PASS" : "FAIL"}  ${input.padEnd(35)} -> "${got}"  (expected "${expected}")`)
}
console.log(`\n${pass}/${cases.length} cases passed`)
process.exit(pass === cases.length ? 0 : 1)
