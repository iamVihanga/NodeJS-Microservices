import { z } from "zod";

// Register input validation schema
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ error: "Email is invalid" }),
  password: z.string().min(6, "Password is required")
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Login input validation schema
export const loginSchema = z.object({
  email: z.email({ error: "Email is invalid" }),
  password: z.string().min(6, "Password is required")
});

export type LoginInput = z.infer<typeof loginSchema>;
