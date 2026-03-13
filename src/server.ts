import { createApp } from "./app";
import { prisma } from "./utils/prisma";

const app = createApp();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  "";

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on ${PORT}`);
  if (!dbUrl) {
    // eslint-disable-next-line no-console
    console.error(
      "[db] DATABASE_URL is empty. Set it in Railway → Backend service → Variables (e.g. link from Postgres)."
    );
    return;
  }
  // Log host only (no password) so we can verify which URL is used
  try {
    const u = new URL(dbUrl);
    // eslint-disable-next-line no-console
    console.log(`[db] Using host: ${u.hostname}`);
  } catch {
    // eslint-disable-next-line no-console
    console.log("[db] DATABASE_URL set (url parse skipped)");
  }
  // Try to connect so logs show success or failure
  prisma
    .$queryRaw`SELECT 1`
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("[db] Connection OK");
    })
    .catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error("[db] Connection failed:", err instanceof Error ? err.message : String(err));
    });
});

