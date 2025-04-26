import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  nickname: z.string().min(2).max(20),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const patchUserSchema = registerSchema.partial();
