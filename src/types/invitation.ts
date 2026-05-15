import type { InvitationStatus, Role } from "./enum";

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  createdAt: string;
  invitedBy: {
    name: string;
    email: string;
  };
}
