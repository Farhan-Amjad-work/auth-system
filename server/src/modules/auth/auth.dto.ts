import { z } from "zod";

export const RegisterDto = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be under 100 characters"),
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be under 100 characters")
    .optional(),
});

export const LoginDto = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterDto = z.infer<typeof RegisterDto>;
export type LoginDto = z.infer<typeof LoginDto>;
