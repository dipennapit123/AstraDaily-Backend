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
  const status =
    err instanceof ApiError ? err.statusCode : (err as any)?.statusCode ?? 500;
  let message =
    err instanceof Error ? err.message : "Unexpected server error.";
  // Surface Prisma validation errors so frontend can show them
  if ((err as any)?.meta?.target || (err as any)?.code) {
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

