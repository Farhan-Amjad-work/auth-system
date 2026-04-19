import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/http.utils";
import { ApiError } from "../../utils/http.utils";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from "../../utils/auth.utils";
import { authService } from "./auth.service";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(
      req.body,
      req.headers["user-agent"],
      req.ip,
    );

    setRefreshTokenCookie(res, result.refreshToken);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(
      req.body,
      req.headers["user-agent"],
      req.ip,
    );

    setRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = getRefreshTokenFromCookie(req);

    if (!refreshToken) {
      throw new ApiError(401, "No refresh token found — please log in again");
    }

    const tokens = await authService.refresh(refreshToken);

    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: tokens.accessToken,
      },
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.sessionId);
    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }),

  logoutAll: asyncHandler(async (req: Request, res: Response) => {
    await authService.logoutAll(req.user!.userId);
    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  }),
};
