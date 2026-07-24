const path = require("node:path");

/** @type {import("prisma").PrismaConfig} */
module.exports = {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "bunx tsx prisma/seed.ts",
  },
};
