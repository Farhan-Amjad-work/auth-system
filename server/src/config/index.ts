import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string({ required_error: "DATABASE_URL is required" }),
  JWT_ACCESS_SECRET: z.string({
    required_error: "JWT_ACCESS_SECRET is required",
  }),
  JWT_REFRESH_SECRET: z.string({
    required_error: "JWT_REFRESH_SECRET is required",
  }),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECRET: z.string({ required_error: "COOKIE_SECRET is required" }),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: Number(parsed.data.PORT),
  databaseUrl: parsed.data.DATABASE_URL,
  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  cookieSecret: parsed.data.COOKIE_SECRET,
  frontendUrl: parsed.data.FRONTEND_URL,
  isProduction: parsed.data.NODE_ENV === "production",
};
