import type { Member } from "./member";

export interface Department {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
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
}

export interface UpdateDepartmentInput {
  name: string;
}

export interface InviteAdminInput {
  email: string;
}
