import { Role } from "./enum";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: {
    id: string;
    name: string;
  } | null;
  isActive?: boolean;
  createdAt: string;
}
