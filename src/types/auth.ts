import { Role } from "./enum";
import { OrganizationType } from "./enum";

export interface User {
     id: string
     name: string
     email: string
     role: Role
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName?: string | null;
  organizationLogo?: string | null;
}

export interface AuthSuccessResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  organizationName: string;
  type: OrganizationType
  name: string;
  email: string;
  password: string;
  organizationLogo?: File | null;
}
