import type { Member } from './member';

export interface Department {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  branchId?: string;
  branch?: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    name: string;
  };
  memberCount: number;
  folderCount: number;
  members?: Member[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentInput {
  name: string;
  branchId?: string;
}

export interface UpdateDepartmentInput {
  name: string;
}

export interface InviteDeptManagerInput {
  email: string;
}

/** @deprecated Use InviteDeptManagerInput */
export type InviteAdminInput = InviteDeptManagerInput;
