import { Role } from './enum';
import { OrganizationType } from './enum';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  role: Role;
  organizationId: string;
  branchId?: string | null;
  departmentId?: string | null;
  organizationName?: string | null;
  organizationLogo?: string | null;
  organizationEmail?: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  profileImage?: string | null;
}

export interface UpdateOrganizationPayload {
  name?: string;
  logo?: string | null;
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
  type: OrganizationType;
  name: string;
  email: string;
  password: string;
  organizationLogo?: File | null;
}
