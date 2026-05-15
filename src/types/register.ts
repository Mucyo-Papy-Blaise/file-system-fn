import { OrganizationType } from "./enum";

export interface RegisterFormValues {
  organizationName: string;
  organizationType: OrganizationType;
  organizationEmail: string;
  fullName: string;
  adminEmail: string;
  password: string;
  confirmPassword: string;
}

export type RegisterErrors = Partial<Record<keyof RegisterFormValues, string>>;
