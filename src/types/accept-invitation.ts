export interface AcceptInvitationFormValues {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type AcceptInvitationErrors = Partial<Record<keyof AcceptInvitationFormValues, string>>;