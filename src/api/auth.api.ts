import { apiClient } from "@/api/api-client";
import type {
  AuthSuccessResponse,
  AuthUser,
  LoginPayload,
  LogoutResponse,
  RegisterPayload,
  UpdateOrganizationPayload,
  UpdateProfilePayload,
} from "@/types/auth";
import type { ApiSuccessEnvelope } from "@/types/http";

type MeUserRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  role: string;
  organizationId: string;
  branchId?: string | null;
  departmentId?: string | null;
  organization?: {
    name?: string | null;
    logo?: string | null;
    email?: string | null;
  } | null;
};

type MeResponse = ApiSuccessEnvelope<MeUserRecord> | MeUserRecord | null;

function unwrapAuthResponse(
  response: AuthSuccessResponse | ApiSuccessEnvelope<AuthSuccessResponse>,
): AuthSuccessResponse {
  return "data" in response ? response.data : response;
}

function normalizeAuthUser(response: MeResponse): AuthUser | null {
  if (!response) return null;

  const rawUser = "data" in response ? response.data : response;

  return {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    phone: rawUser.phone ?? null,
    profileImage: rawUser.profileImage ?? null,
    role: rawUser.role as AuthUser["role"],
    branchId: rawUser.branchId ?? null,
    departmentId: rawUser.departmentId ?? null,
    organizationId: rawUser.organizationId,
    organizationName:
      "organization" in rawUser
        ? rawUser.organization?.name ?? null
        : "organizationName" in rawUser
          ? ((rawUser as { organizationName?: string | null }).organizationName ??
            null)
          : null,
    organizationLogo:
      "organization" in rawUser
        ? rawUser.organization?.logo ?? null
        : "organizationLogo" in rawUser
          ? ((rawUser as { organizationLogo?: string | null }).organizationLogo ??
            null)
          : null,
    organizationEmail:
      "organization" in rawUser
        ? rawUser.organization?.email ?? null
        : "organizationEmail" in rawUser
          ? (rawUser as { organizationEmail?: string | null }).organizationEmail ??
            null
          : null,
  };
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthSuccessResponse> {
    const response = await apiClient.post<
      AuthSuccessResponse | ApiSuccessEnvelope<AuthSuccessResponse>,
      LoginPayload
    >("/auth/login", payload, { withCredentials: true });
    return unwrapAuthResponse(response);
  },

  async register(payload: RegisterPayload): Promise<AuthSuccessResponse> {
    const formData = new FormData();
    formData.append("organizationName", payload.organizationName);
    formData.append("type", payload.type);
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    if (payload.organizationLogo) {
      formData.append("organizationLogo", payload.organizationLogo);
    }
    const response = await apiClient.postFormData<
      AuthSuccessResponse | ApiSuccessEnvelope<AuthSuccessResponse>
    >("/auth/register", formData, { withCredentials: true });
    return unwrapAuthResponse(response);
  },

  async me(): Promise<AuthUser | null> {
    const response = await apiClient.get<MeResponse>("/auth/me");
    return normalizeAuthUser(response);
  },

  async logout(): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>("/auth/logout", undefined, {
      withCredentials: true,
    });
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser | null> {
    const response = await apiClient.patch<MeResponse>("/auth/profile", payload);
    return normalizeAuthUser(response);
  },

  async updateOrganization(
    payload: UpdateOrganizationPayload,
  ): Promise<AuthUser | null> {
    const response = await apiClient.patch<MeResponse>(
      "/auth/organization",
      payload,
    );
    return normalizeAuthUser(response);
  },
};
