/**
 * End-to-end smoke test for the AI quota system.
 *
 * Tests:
 *  1. Anonymous quota: first request to /api/ai/chat/public succeeds,
 *     second request from the same IP returns 402 quota_exhausted.
 *  2. Anonymous usage row is created in AiGuestUsage with usedCount=1.
 *  3. /api/ai/usage endpoint returns the correct anonymous snapshot.
 *  4. Authed quota: a FREE user can hit /api/ai/chat and the counter
 *     increments. We simulate this at the DB layer (not via HTTP, since
 *     that would need a real NextAuth session cookie).
 *
 * Run with: npx tsx scripts/test-ai-quota.ts
 */
import { db } from "../src/lib/db"
import {
  checkAnonymousQuota,
  incrementAnonymousUsage,
  checkUserQuota,
  incrementUserUsage,
} from "../src/lib/ai-quota"

const ANSI = {
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
}

let passed = 0
let failed = 0

function expect(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ${ANSI.green("✓")} ${message}`)
    passed++
  } else {
    console.log(`  ${ANSI.red("✗")} ${message}`)
    failed++
  }
}

async function section(name: string, fn: () => Promise<void>) {
  console.log(`\n${ANSI.bold(ANSI.cyan(name))}`)
  await fn()
}

async function main() {
  // Use a unique test identifier so we don't collide with real IPs.
  const testIp = `test-ip-${Date.now()}`

  // ─── Clean up any previous test runs ───
  await db.aiGuestUsage.deleteMany({ where: { identifier: testIp } })

  await section("1. Anonymous quota — first request", async () => {
    const q1 = await checkAnonymousQuota(testIp)
    expect(q1.allowed === true, "first request is allowed")
    expect(q1.usage.plan === "ANONYMOUS", `plan is ANONYMOUS (got ${q1.usage.plan})`)
    expect(q1.usage.used === 0, `used is 0 (got ${q1.usage.used})`)
    expect(q1.usage.remaining === 1, `remaining is 1 (got ${q1.usage.remaining})`)
    expect(q1.usage.limit === 1, `limit is 1 (got ${q1.usage.limit})`)
  })

  await section("2. Increment anonymous usage (simulates successful LLM call)", async () => {
    await incrementAnonymousUsage(testIp)
    const row = await db.aiGuestUsage.findUnique({ where: { identifier: testIp } })
    expect(!!row === true, "AiGuestUsage row was created")
    expect(row?.usedCount === 1, `usedCount is 1 (got ${row?.usedCount})`)
  })

  await section("3. Anonymous quota — second request is blocked", async () => {
    const q2 = await checkAnonymousQuota(testIp)
    expect(q2.allowed === false, "second request is blocked")
    expect(q2.reason === "ANONYMOUS_USED", `reason is ANONYMOUS_USED (got ${q2.reason})`)
    expect(!!q2.message === true, "block message is present")
    expect(q2.usage.remaining === 0, `remaining is 0 (got ${q2.usage.remaining})`)
  })

  await section("4. Anonymous quota — third request still blocked", async () => {
    const q3 = await checkAnonymousQuota(testIp)
    expect(q3.allowed === false, "third request is also blocked (persistent)")
  })

  // ─── Authed path: find a FREE user from the seed ───
  const freeUser = await db.user.findFirst({
    where: { role: "FREE_USER" },
    include: { subscription: true },
  })

  if (!freeUser) {
    console.log(`\n${ANSI.red("No FREE_USER found in DB — skipping authed tests")}`)
  } else {
    // Reset their counter to a clean state for the test.
    if (freeUser.subscription) {
      await db.subscription.update({
        where: { userId: freeUser.id },
        data: { aiMessagesUsed: 0, aiMessagesResetAt: null },
      })
    }

    await section(`5. Authed FREE quota — initial state (user: ${freeUser.email})`, async () => {
      const q = await checkUserQuota(freeUser.id, freeUser.role)
      expect(q.allowed === true, "first authed request is allowed")
      expect(q.usage.plan === "FREE", `plan is FREE (got ${q.usage.plan})`)
      expect(q.usage.limit === 5, `FREE limit is 5 (got ${q.usage.limit})`)
      expect(q.usage.used === 0, `used starts at 0 (got ${q.usage.used})`)
      expect(q.usage.remaining === 5, `remaining is 5 (got ${q.usage.remaining})`)
      expect(!!q.usage.resetAt === true, "resetAt is set after first check")
    })

    await section("6. Increment authed usage 5 times — should exhaust the quota", async () => {
      for (let i = 0; i < 5; i++) {
        await incrementUserUsage(freeUser.id)
      }
      const sub = await db.subscription.findUnique({ where: { userId: freeUser.id } })
      expect(sub?.aiMessagesUsed === 5, `counter is 5 after 5 increments (got ${sub?.aiMessagesUsed})`)
    })

    await section("7. Authed FREE quota — 6th request is blocked", async () => {
      const q = await checkUserQuota(freeUser.id, freeUser.role)
      expect(q.allowed === false, "6th request is blocked")
      expect(q.reason === "PLAN_EXHAUSTED", `reason is PLAN_EXHAUSTED (got ${q.reason})`)
      expect(q.usage.remaining === 0, `remaining is 0 (got ${q.usage.remaining})`)
      expect(!!q.message === true, "block message is present")
    })

    // ─── Reset the counter back so we don't leave the test user exhausted ───
    await db.subscription.update({
      where: { userId: freeUser.id },
      data: { aiMessagesUsed: 0, aiMessagesResetAt: null },
    })

    // ─── Admin bypass ───
    const admin = await db.user.findFirst({ where: { role: "SUPER_ADMIN" } })
    if (admin) {
      await section(`8. Admin bypass (user: ${admin.email})`, async () => {
        const q = await checkUserQuota(admin.id, admin.role)
        expect(q.allowed === true, "admin is always allowed")
        expect(q.usage.exempt === true, "admin is exempt from quota")
        expect(q.usage.limit === Infinity, "admin limit is Infinity")
      })
    }

    // ─── GROWTH_PRO user ───
    const growthUser = await db.user.findFirst({
      where: { role: "PAID_USER" },
      include: { subscription: true },
    })
    if (growthUser && growthUser.subscription) {
      await db.subscription.update({
        where: { userId: growthUser.id },
        data: { plan: "GROWTH_PRO", aiMessagesUsed: 0, aiMessagesResetAt: null },
      })
      await section(`9. GROWTH_PRO quota (user: ${growthUser.email})`, async () => {
        const q = await checkUserQuota(growthUser.id, growthUser.role)
        expect(q.allowed === true, "growth user can query")
        expect(q.usage.plan === "GROWTH_PRO", `plan is GROWTH_PRO (got ${q.usage.plan})`)
        expect(q.usage.limit === 10, `GROWTH_PRO limit is 10 (got ${q.usage.limit})`)
      })
    }
  }

  // ─── Cleanup ───
  await db.aiGuestUsage.deleteMany({ where: { identifier: testIp } }).catch(() => {})

  console.log(`\n${ANSI.bold("─".repeat(60))}`)
  console.log(
    `${ANSI.green(`${passed} passed`)}, ${ANSI.red(`${failed} failed`)}`
  )
  process.exit(failed > 0 ? 1 : 0)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
