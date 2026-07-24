import { db } from "../src/lib/db"

async function main() {
  const tables = await db.$queryRaw<{ name: string }[]>`
    SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
  `
  console.log("Tables in DB:")
  for (const t of tables) console.log(" -", t.name)

  const subCols = await db.$queryRaw<{ name: string; type: string }[]>`
    PRAGMA table_info(Subscription);
  `
  console.log("\nSubscription columns:")
  for (const c of subCols) console.log(` - ${c.name} (${c.type})`)

  const guestCols = await db.$queryRaw<{ name: string; type: string }[]>`
    PRAGMA table_info(AiGuestUsage);
  `
  console.log("\nAiGuestUsage columns:")
  for (const c of guestCols) console.log(` - ${c.name} (${c.type})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
