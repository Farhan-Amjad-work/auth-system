import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth.utils";
import { ApiError } from "../utils/http.utils";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Access token missing"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Access token missing"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired"));
    }
    next(new ApiError(401, "Invalid access token"));
  }
};
