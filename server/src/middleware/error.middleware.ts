import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/http.utils";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error("[Unexpected Error]", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
