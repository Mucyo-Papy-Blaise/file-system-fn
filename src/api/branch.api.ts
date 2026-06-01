import { apiClient } from '@/api/api-client';
import type { ApiSuccessEnvelope } from '@/types/http';
import type {
  Branch,
  CreateBranchInput,
  InviteBranchManagerInput,
  UpdateBranchInput,
} from '@/types/branch';

type BranchApiRecord = Branch & {
  _count?: {
    departments: number;
    users: number;
  };
};

function normalizeBranch(branch: BranchApiRecord): Branch {
  return {
    ...branch,
    departmentCount:
      branch.departmentCount ??
      branch._count?.departments ??
      branch.departments?.length ??
      0,
    memberCount: branch.memberCount ?? branch._count?.users ?? 0,
  };
}

export const branchApi = {
  async createBranch(data: CreateBranchInput): Promise<Branch> {
    const response = await apiClient.post<
      ApiSuccessEnvelope<BranchApiRecord>,
      CreateBranchInput
    >('/branches', data);

    return normalizeBranch(response.data);
  },

  async getBranches(): Promise<Branch[]> {
    const response = await apiClient.get<ApiSuccessEnvelope<BranchApiRecord[]>>(
      '/branches',
    );

    return response.data.map(normalizeBranch);
  },

  async getBranchBySlug(slug: string): Promise<Branch> {
    const response = await apiClient.get<ApiSuccessEnvelope<BranchApiRecord>>(
      `/branches/${encodeURIComponent(slug)}`,
    );

    return normalizeBranch(response.data);
  },

  async updateBranch(slug: string, data: UpdateBranchInput): Promise<Branch> {
    const response = await apiClient.patch<
      ApiSuccessEnvelope<BranchApiRecord>,
      UpdateBranchInput
    >(`/branches/${encodeURIComponent(slug)}`, data);

    return normalizeBranch(response.data);
  },

  async deleteBranch(slug: string): Promise<void> {
    await apiClient.delete<void>(`/branches/${encodeURIComponent(slug)}`);
  },

  async inviteBranchManager(
    slug: string,
    data: InviteBranchManagerInput,
  ): Promise<void> {
    await apiClient.post<void>(
      `/branches/${encodeURIComponent(slug)}/invite-manager`,
      data,
    );
  },
};
