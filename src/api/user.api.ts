import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import { Role } from "@/types/enum";

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  branch?: { id: string; name: string } | null;
  department?: { id: string; name: string } | null;
}

type OrgMemberApiRecord = OrgMember;

export const userApi = {
  async getOrganizationMembers(): Promise<OrgMember[]> {
    const response = await apiClient.get<ApiSuccessEnvelope<OrgMemberApiRecord[]>>(
      "/users",
    );

    return response.data;
  },
};
