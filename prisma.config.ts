import "dotenv/config";
import { defineConfig } from "prisma/config";

// Use placeholder during build (e.g. Railway) when DATABASE_URL isn't set yet.
// Runtime and migrations use the real DATABASE_URL from the environment.
const databaseUrl =
  process.env.DATABASE_URL || "postgresql://localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
