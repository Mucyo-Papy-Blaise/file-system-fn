import { apiClient } from "@/api/api-client";
import type {
  AuthSuccessResponse,
  AuthUser,
  LoginPayload,
  LogoutResponse,
  RegisterPayload,
} from "@/types/auth";
import type { ApiSuccessEnvelope } from "@/types/http";

type MeResponse = ApiSuccessEnvelope<{
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  departmentId?: string | null;
  organization?: {
    name?: string | null;
    logo?: string | null;
  } | null;
}> | AuthUser | null;

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
    role: rawUser.role as AuthUser["role"],
    departmentId: rawUser.departmentId ?? null,
    organizationId: rawUser.organizationId,
    organizationName:
      "organization" in rawUser
        ? rawUser.organization?.name ?? null
        : "organizationName" in rawUser
          ? rawUser.organizationName ?? null
          : null,
    organizationLogo:
      "organization" in rawUser
        ? rawUser.organization?.logo ?? null
        : "organizationLogo" in rawUser
          ? rawUser.organizationLogo ?? null
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
};
