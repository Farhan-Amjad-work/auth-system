import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { config } from "../config";
import type {
  JwtPayload,
  RefreshTokenPayload,
  TokenPair,
} from "../modules/auth/auth.types";

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_COOKIE = "refresh_token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// ─── hashing ─────────────────────────────────────────────

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = (
  plain: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

export const hashToken = (token: string): Promise<string> => {
  return bcrypt.hash(token, SALT_ROUNDS);
};

export const compareToken = (
  plain: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

// ─── jwt ─────────────────────────────────────────────────

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiresIn,
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtAccessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, config.jwtRefreshSecret) as RefreshTokenPayload;
};

export const buildTokenPair = (
  userId: string,
  email: string,
  sessionId: string,
): TokenPair => {
  return {
    accessToken: signAccessToken({ userId, email, sessionId }),
    refreshToken: signRefreshToken({ userId, sessionId }),
  };
};

// ─── cookies ─────────────────────────────────────────────

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string,
): void => {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? "strict" : "lax",
    maxAge: SEVEN_DAYS_MS,
    path: "/api/auth",
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? "strict" : "lax",
    path: "/api/auth",
  });
};

export const getRefreshTokenFromCookie = (req: Request): string | undefined => {
  return req.cookies[REFRESH_TOKEN_COOKIE];
};
