import type { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let status =
    err instanceof ApiError ? err.statusCode : (err as any)?.statusCode ?? 500;
  let message =
    err instanceof Error ? err.message : "Unexpected server error.";

  // Prisma ECONNREFUSED = database unreachable (DATABASE_URL wrong or Postgres not running)
  if ((err as any)?.code === "ECONNREFUSED" || (err as any)?.code === "P1001") {
    status = 503;
    message =
      "Database connection refused. On Railway: set DATABASE_URL on the backend service (link from Postgres) and ensure Postgres is running.";
  } else if ((err as any)?.meta?.target || (err as any)?.code) {
    const prismaMsg = (err as any).message;
    if (typeof prismaMsg === "string" && prismaMsg.length < 300) {
      message = prismaMsg;
    }
  }

  if (process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  const origin = req.header("Origin");
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.status(status).json({
    success: false,
    error: {
      message,
    },
  });
};

