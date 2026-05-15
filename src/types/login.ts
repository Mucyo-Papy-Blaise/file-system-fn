export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type LoginErrors = Partial<Record<"email" | "password", string>>;
