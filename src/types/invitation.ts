import type { InvitationStatus, Role } from './enum';

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  branchId?: string;
  departmentId?: string;
  createdAt: string;
  invitedBy: {
    name: string;
    email: string;
  };
}
