import { db } from "../src/lib/db"

async function main() {
  const subs = await db.subscription.findMany({
    select: {
      userId: true,
      plan: true,
      status: true,
      aiMessagesUsed: true,
      aiMessagesResetAt: true,
      user: { select: { email: true, role: true } },
    },
    take: 10,
  })
  console.log("Sample subscriptions (with AI quota fields):")
  for (const s of subs) {
    console.log(
      ` - ${s.user.email} [${s.user.role}] plan=${s.plan} used=${s.aiMessagesUsed} resetAt=${s.aiMessagesResetAt?.toISOString() ?? "null"}`
    )
  }

  const guestCount = await db.aiGuestUsage.count()
  console.log(`\nAiGuestUsage rows: ${guestCount} (expected 0 — none used yet)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
