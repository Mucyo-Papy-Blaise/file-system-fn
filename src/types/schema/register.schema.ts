import { z } from "zod";
import type { RegisterErrors, RegisterFormValues } from "@/types/register";
import { OrganizationType } from "@/types/enum";

export const registerSchema = z
  .object({
    organizationName: z.string().trim().min(2, "Organization name must have at least 2 characters."),
    organizationType: z.nativeEnum(OrganizationType),
    organizationEmail: z
      .string()
      .trim()
      .optional()
      .transform((value) => value ?? ""),
    fullName: z.string().trim().min(2, "Admin full name must have at least 2 characters."),
    adminEmail: z
      .string()
      .trim()
      .min(1, "Admin email is required.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must contain at least one letter and one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .superRefine((value, ctx) => {
    if (value.organizationType === OrganizationType.COMPANY) {
      if (!value.organizationEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["organizationEmail"],
          message: "Organization email is required.",
        });
        return;
      }

      if (!z.string().email().safeParse(value.organizationEmail).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["organizationEmail"],
          message: "Enter a valid organization email address.",
        });
      }
    }
  });

export function validateRegisterForm(values: RegisterFormValues): RegisterErrors {
  const parsed = registerSchema.safeParse(values);
  if (parsed.success) return {};

  const fieldErrors = parsed.error.flatten().fieldErrors;

  return {
    organizationName: fieldErrors.organizationName?.[0],
    organizationType: fieldErrors.organizationType?.[0],
    organizationEmail: fieldErrors.organizationEmail?.[0],
    fullName: fieldErrors.fullName?.[0],
    adminEmail: fieldErrors.adminEmail?.[0],
    password: fieldErrors.password?.[0],
    confirmPassword: fieldErrors.confirmPassword?.[0],
  };
}
