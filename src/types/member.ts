import { Role } from "./enum";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}
