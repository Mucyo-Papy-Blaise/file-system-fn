import type { Department } from './department';

export interface Branch {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  manager?: {
    id: string;
    name: string;
  };
  departmentCount: number;
  memberCount: number;
  departments?: Department[];
  users?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    departmentId?: string | null;
  }>;
}

export interface CreateBranchInput {
  name: string;
}

export interface UpdateBranchInput {
  name?: string;
}

export interface InviteBranchManagerInput {
  email: string;
}
