/**
 * End-to-end HTTP test of the authed AI quota flow.
 *
 * 1. Logs in as james@startup.io (FREE_USER, password: password123)
 *    via NextAuth's credentials endpoint.
 * 2. Calls GET /api/ai/usage → should show plan=FREE, limit=5, used=0.
 * 3. Calls GET /api/ai/chat → should also include the usage snapshot.
 * 4. Manually sets aiMessagesUsed=5 in the DB to simulate an exhausted
 *    monthly quota, then calls POST /api/ai/chat → should return 402
 *    quota_exhausted with the upgrade URL.
 * 5. Resets the counter back to 0 for cleanliness.
 */
import { db } from "../src/lib/db"

const BASE = "http://localhost:3001"
const EMAIL = "james@startup.io"
const PASSWORD = "password123"

async function main() {
  // ─── 1. Get CSRF token ───
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`, {
    credentials: "include",
  })
  const setCookie = csrfRes.headers.getSetCookie?.() ?? []
  const cookies = setCookie.map((c) => c.split(";")[0]).join("; ")
  const { csrfToken } = await csrfRes.json()
  console.log("✓ Got CSRF token")

  // ─── 2. Sign in with credentials ───
  const signInRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies,
    },
    body: new URLSearchParams({
      email: EMAIL,
      password: PASSWORD,
      csrfToken,
      callbackUrl: "/dashboard",
      json: "true",
    }),
    redirect: "manual",
    credentials: "include",
  })
  const signInCookies = signInRes.headers.getSetCookie?.() ?? []
  const allCookies = [
    ...setCookie.map((c) => c.split(";")[0]),
    ...signInCookies.map((c) => c.split(";")[0]),
  ].join("; ")
  console.log(`✓ Sign-in returned ${signInRes.status}`)

  // ─── 3. GET /api/ai/usage ───
  const usageRes = await fetch(`${BASE}/api/ai/usage`, {
    headers: { Cookie: allCookies },
    credentials: "include",
  })
  const usage = await usageRes.json()
  console.log(`✓ GET /api/ai/usage → ${usageRes.status}`)
  console.log(
    `  plan=${usage.plan} used=${usage.used} limit=${usage.limit} remaining=${usage.remaining} authenticated=${usage.authenticated}`
  )
  if (usage.plan !== "FREE" || usage.limit !== 5 || usage.used !== 0) {
    throw new Error(`Unexpected usage snapshot: ${JSON.stringify(usage)}`)
  }

  // ─── 4. GET /api/ai/chat (status, should include usage) ───
  const statusRes = await fetch(`${BASE}/api/ai/chat`, {
    headers: { Cookie: allCookies },
    credentials: "include",
  })
  const status = await statusRes.json()
  console.log(`✓ GET /api/ai/chat → ${statusRes.status}, label=${status.label}`)
  if (status.usage?.plan !== "FREE") {
    throw new Error(`Status response missing FREE usage: ${JSON.stringify(status.usage)}`)
  }

  // ─── 5. Simulate exhausted quota at the DB layer ───
  const user = await db.user.findUnique({
    where: { email: EMAIL },
    select: { id: true, role: true },
  })
  if (!user) throw new Error("test user not found")
  await db.subscription.update({
    where: { userId: user.id },
    data: { aiMessagesUsed: 5, aiMessagesResetAt: new Date(Date.now() + 86400000) },
  })
  console.log("✓ Manually set aiMessagesUsed=5 (simulating exhausted quota)")

  // ─── 6. POST /api/ai/chat → should return 402 BEFORE calling NVIDIA ───
  const chatRes = await fetch(`${BASE}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: allCookies,
    },
    body: JSON.stringify({ message: "test", history: [] }),
    credentials: "include",
  })
  const chatData = await chatRes.json()
  console.log(`✓ POST /api/ai/chat with exhausted quota → HTTP ${chatRes.status}`)
  console.log(`  error=${chatData.error}`)
  console.log(`  upgradeUrl=${chatData.upgradeUrl}`)
  console.log(`  usage.plan=${chatData.usage?.plan} usage.remaining=${chatData.usage?.remaining}`)
  if (chatRes.status !== 402 || chatData.error !== "quota_exhausted") {
    throw new Error(`Expected 402 quota_exhausted, got ${chatRes.status}: ${JSON.stringify(chatData)}`)
  }

  // ─── 7. Reset quota back to 0 ───
  await db.subscription.update({
    where: { userId: user.id },
    data: { aiMessagesUsed: 0, aiMessagesResetAt: null },
  })
  console.log("✓ Reset test user's quota back to 0")

  console.log("\n🎉 All HTTP quota tests passed!")
}

main()
  .catch((e) => {
    console.error("\n❌ Test failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
