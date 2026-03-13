import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Read at runtime so Railway env vars are always used (not cached from env.ts load)
function getDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ||
    process.env.DATABASE_PRIVATE_URL ||
    process.env.DATABASE_PUBLIC_URL ||
    "";
  return url.trim();
}

const connectionString = getDatabaseUrl();

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
    }),
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

