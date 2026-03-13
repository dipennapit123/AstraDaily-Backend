import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL from env (Railway sets it). Placeholder only for prisma generate when no DB (e.g. CI build).
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  "postgresql://localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
