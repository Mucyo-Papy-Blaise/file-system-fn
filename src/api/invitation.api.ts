import { apiClient } from "@/api/api-client";
import { InvitationStatus } from "@/types/enum";
import type { Invitation } from "@/types/invitation";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  AcceptInvitationInput,
  InviteMemberInput,
} from "@/types/schema/invitation.schema";

type InvitationApiRecord = {
  id: string;
  email: string;
  role: Invitation["role"];
  status: InvitationStatus;
  branchId?: string | null;
  departmentId?: string | null;
  createdAt: string;
  invitedBy: {
    name: string;
    email: string;
  };
};

function normalizeInvitation(invitation: InvitationApiRecord): Invitation {
  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    status: invitation.status,
    branchId: invitation.branchId ?? undefined,
    departmentId: invitation.departmentId ?? undefined,
    createdAt: invitation.createdAt,
    invitedBy: invitation.invitedBy,
  };
}

function buildInvitationsPath(status?: InvitationStatus): string {
  return status ? `/invitations?status=${encodeURIComponent(status)}` : "/invitations";
}

export const invitationApi = {
  async inviteMember(data: InviteMemberInput): Promise<Invitation> {
    const response = await apiClient.post<
      ApiSuccessEnvelope<InvitationApiRecord>,
      InviteMemberInput
    >("/invitations", data);

    return normalizeInvitation(response.data);
  },

  async getInvitationDetails(token: string): Promise<{
    id: string;
    email: string;
    role: Invitation["role"];
    status: InvitationStatus;
    expiresAt: string;
    organization: {
      id: string;
      name: string;
    };
    invitedBy: {
      id: string;
      name: string;
      email: string;
    };
  }> {
    const response = await apiClient.get<
      ApiSuccessEnvelope<{
        id: string;
        email: string;
        role: Invitation["role"];
        status: InvitationStatus;
        expiresAt: string;
        organization: {
          id: string;
          name: string;
        };
        invitedBy: {
          id: string;
          name: string;
          email: string;
        };
      }>
    >(`/invitations/details/${encodeURIComponent(token)}`);

    return response.data;
  },

  async acceptInvitation(data: AcceptInvitationInput & { token: string }): Promise<unknown> {
    const response = await apiClient.post<
      ApiSuccessEnvelope<unknown>,
      AcceptInvitationInput & { token: string }
    >("/invitations/accept", data);

    return response.data;
  },

  async cancelInvitation(id: string): Promise<Invitation> {
    const response = await apiClient.patch<ApiSuccessEnvelope<InvitationApiRecord>>(
      `/invitations/${id}/cancel`,
    );

    return normalizeInvitation(response.data);
  },

  async getInvitations(status?: InvitationStatus): Promise<Invitation[]> {
    const response = await apiClient.get<ApiSuccessEnvelope<InvitationApiRecord[]>>(
      buildInvitationsPath(status),
    );

    return response.data.map(normalizeInvitation);
  },
};
