import type { InvitationStatus, Role } from "./enum";

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  departmentId?: string;
  createdAt: string;
  invitedBy: {
    name: string;
    email: string;
  };
}
