"use client";

import type { RegisterErrors, RegisterFormValues } from "@/types/register";
import { UnderlineField } from "./Underlinefield";

interface RegisterAdminStepProps {
  values: RegisterFormValues;
  errors: RegisterErrors;
  onUpdateValue: <K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K],
  ) => void;
}

export function RegisterAdminStep({
  values,
  errors,
  onUpdateValue,
}: RegisterAdminStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <UnderlineField
        id="fullName"
        label="Full name"
        type="text"
        value={values.fullName}
        onChange={(value) => onUpdateValue("fullName", value)}
        error={errors.fullName}
        autoComplete="name"
        placeholder="Your full name"
      />

      <UnderlineField
        id="adminEmail"
        label="Email address"
        type="email"
        value={values.adminEmail}
        onChange={(value) => onUpdateValue("adminEmail", value)}
        error={errors.adminEmail}
        autoComplete="email"
        placeholder="admin@workspace.com"
      />

      <UnderlineField
        id="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={(value) => onUpdateValue("password", value)}
        error={errors.password}
        autoComplete="new-password"
        placeholder="Create password"
      />

      <UnderlineField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        value={values.confirmPassword}
        onChange={(value) => onUpdateValue("confirmPassword", value)}
        error={errors.confirmPassword}
        autoComplete="new-password"
        placeholder="Confirm password"
      />
    </div>
  );
}
