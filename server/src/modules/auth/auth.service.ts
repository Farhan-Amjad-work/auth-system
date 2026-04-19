import { authRepository } from "./auth.repository";
import {
  hashPassword,
  comparePassword,
  hashToken,
  compareToken,
  buildTokenPair,
  verifyRefreshToken,
} from "../../utils/auth.utils";
import { ApiError } from "../../utils/http.utils";
import type { RegisterDto, LoginDto } from "./auth.dto";
import type { TokenPair, AuthResponse } from "./auth.types";

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

const getRefreshExpiryDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);
  return date;
};

export const authService = {
  register: async (
    dto: RegisterDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> => {
    const existing = await authRepository.findUserByEmail(dto.email);
    if (existing) throw new ApiError(409, "Email is already registered");

    const hashedPassword = await hashPassword(dto.password);

    const user = await authRepository.createUser({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const session = await authRepository.createSession({
      userId: user.id,
      refreshTokenHash: "placeholder",
      userAgent,
      ipAddress,
      expiresAt: getRefreshExpiryDate(),
    });

    const tokens = buildTokenPair(user.id, user.email, session.id);

    await authRepository.updateSessionToken(session.id, {
      refreshTokenHash: await hashToken(tokens.refreshToken),
      expiresAt: getRefreshExpiryDate(),
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  login: async (
    dto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> => {
    const user = await authRepository.findUserByEmail(dto.email);
    if (!user) throw new ApiError(401, "Invalid email or password");

    const passwordMatch = await comparePassword(dto.password, user.password);
    if (!passwordMatch) throw new ApiError(401, "Invalid email or password");

    const session = await authRepository.createSession({
      userId: user.id,
      refreshTokenHash: "placeholder",
      userAgent,
      ipAddress,
      expiresAt: getRefreshExpiryDate(),
    });

    const tokens = buildTokenPair(user.id, user.email, session.id);

    await authRepository.updateSessionToken(session.id, {
      refreshTokenHash: await hashToken(tokens.refreshToken),
      expiresAt: getRefreshExpiryDate(),
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  refresh: async (refreshToken: string): Promise<TokenPair> => {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err: any) {
      if (err?.name === "TokenExpiredError") {
        throw new ApiError(401, "Refresh token expired — please log in again");
      }
      throw new ApiError(401, "Invalid refresh token — please log in again");
    }

    const session = await authRepository.findSessionById(payload.sessionId);
    if (!session)
      throw new ApiError(401, "Session not found — please log in again");

    if (session.expiresAt < new Date()) {
      await authRepository.deleteSession(session.id);
      throw new ApiError(401, "Session expired — please log in again");
    }

    const tokenMatch = await compareToken(
      refreshToken,
      session.refreshTokenHash,
    );
    if (!tokenMatch) {
      await authRepository.deleteSession(session.id);
      throw new ApiError(
        401,
        "Refresh token reuse detected — please log in again",
      );
    }

    const user = await authRepository.findUserById(session.userId);
    if (!user) throw new ApiError(401, "User no longer exists");

    const tokens = buildTokenPair(user.id, user.email, session.id);

    await authRepository.updateSessionToken(session.id, {
      refreshTokenHash: await hashToken(tokens.refreshToken),
      expiresAt: getRefreshExpiryDate(),
    });

    return tokens;
  },

  logout: async (sessionId: string): Promise<void> => {
    const session = await authRepository.findSessionById(sessionId);
    if (!session) return;
    await authRepository.deleteSession(sessionId);
  },

  logoutAll: async (userId: string): Promise<void> => {
    await authRepository.deleteAllUserSessions(userId);
  },
};
