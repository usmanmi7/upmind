/**
 * Manually mark a test IP as having used their 1 free answer,
 * so we can verify the public endpoint returns 402 on the next request
 * without needing a working NVIDIA API key.
 */
import { db } from "../src/lib/db"

async function main() {
  const identifier = "127.0.0.1" // localhost (what curl will appear as)
  // Also handle the IPv6 loopback ::1
  const identifierV6 = "::1"

  await db.aiGuestUsage.upsert({
    where: { identifier },
    update: { usedCount: 1, lastUsedAt: new Date() },
    create: { identifier, usedCount: 1 },
  })
  await db.aiGuestUsage.upsert({
    where: { identifier: identifierV6 },
    update: { usedCount: 1, lastUsedAt: new Date() },
    create: { identifier: identifierV6, usedCount: 1 },
  })

  console.log("✓ Marked 127.0.0.1 and ::1 as having used their free answer")
  const rows = await db.aiGuestUsage.findMany({
    where: { identifier: { in: [identifier, identifierV6] } },
  })
  for (const r of rows) {
    console.log(`  - ${r.identifier}: usedCount=${r.usedCount}`)
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
