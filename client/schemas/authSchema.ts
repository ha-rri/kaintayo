import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .min(3, "Username must be at least 3 characters"),
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? "Email is required" : "Invalid email address",
  }),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? "Email is required" : "Invalid email address",
  }),
  password: z.string({ error: "Password is required" }),
});
