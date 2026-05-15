import { z } from "zod";
import type { AcceptInvitationErrors, AcceptInvitationFormValues } from "@/types/accept-invitation.ts";

export const acceptInvitationSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    phone: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value?.length ? value : "")),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export function validateAcceptInvitationForm(values: AcceptInvitationFormValues): AcceptInvitationErrors {
  const parsed = acceptInvitationSchema.safeParse(values);
  if (parsed.success) return {};

  const fieldErrors = parsed.error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    phone: fieldErrors.phone?.[0],
    password: fieldErrors.password?.[0],
    confirmPassword: fieldErrors.confirmPassword?.[0],
  };
}