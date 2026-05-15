"use client";

import type {
  AcceptInvitationErrors,
  AcceptInvitationFormValues,
} from "@/types/accept-invitation.ts";
import { UnderlineField } from "./Underlinefield";

interface AcceptInvitationStepProps {
  values: AcceptInvitationFormValues;
  errors: AcceptInvitationErrors;
  invitationEmail: string;
  onUpdateValue: (key: keyof AcceptInvitationFormValues, value: string) => void;
}

export function AcceptInvitationStep({
  values,
  errors,
  invitationEmail,
  onUpdateValue,
}: AcceptInvitationStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <UnderlineField
        id="email"
        label="Email address"
        type="email"
        value={invitationEmail}
        onChange={() => {}} // Read-only
        error={undefined}
        autoComplete="email"
        placeholder="your@email.com"
        disabled
      />

      <UnderlineField
        id="name"
        label="Full name"
        type="text"
        value={values.name}
        onChange={(value) => onUpdateValue("name", value)}
        error={errors.name}
        autoComplete="name"
        placeholder="Your full name"
      />

      <UnderlineField
        id="phone"
        label="Phone number (optional)"
        type="tel"
        value={values.phone}
        onChange={(value) => onUpdateValue("phone", value)}
        error={errors.phone}
        autoComplete="tel"
        placeholder="+1234567890"
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
