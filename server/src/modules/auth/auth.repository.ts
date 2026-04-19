import { prisma } from "../../db/prisma";
import type { RegisterDto } from "./auth.dto";

export const authRepository = {
  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findUserById: (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  createUser: (
    data: Omit<RegisterDto, "name"> & { password: string; name?: string },
  ) => {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  },

  createSession: (data: {
    userId: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) => {
    return prisma.session.create({ data });
  },

  findSessionById: (id: string) => {
    return prisma.session.findUnique({
      where: { id },
    });
  },

  updateSessionToken: (
    sessionId: string,
    data: {
      refreshTokenHash: string;
      expiresAt: Date;
    },
  ) => {
    return prisma.session.update({
      where: { id: sessionId },
      data,
    });
  },

  deleteSession: (sessionId: string) => {
    return prisma.session.delete({
      where: { id: sessionId },
    });
  },

  deleteAllUserSessions: (userId: string) => {
    return prisma.session.deleteMany({
      where: { userId },
    });
  },
};
