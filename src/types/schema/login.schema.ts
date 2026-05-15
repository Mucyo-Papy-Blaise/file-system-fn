import { z } from "zod";
import type { LoginErrors, LoginFormValues } from "@/types/login";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean(),
});

export function validateLoginForm(values: LoginFormValues): LoginErrors {
  const parsed = loginSchema.safeParse(values);
  if (parsed.success) return {};

  const fieldErrors = parsed.error.flatten().fieldErrors;
  return {
    email: fieldErrors.email?.[0],
    password: fieldErrors.password?.[0],
  };
}
