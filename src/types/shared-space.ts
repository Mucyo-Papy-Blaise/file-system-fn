import type { Document } from "./document";
import type { Role } from "./enum";

export enum SharedLevel {
  ORGANIZATION = "ORGANIZATION",
  BRANCH = "BRANCH",
  DEPARTMENT = "DEPARTMENT",
}

export interface SharedSpace {
  id: string;
  name: string;
  description?: string | null;
  level: SharedLevel;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  branchId?: string | null;
  departmentId?: string | null;
  createdBy: {
    id: string;
    name: string;
    role?: Role;
  };
  documentCount: number;
  documents?: SharedSpaceDocument[];
}

export interface SharedSpaceDocument {
  sharedSpaceId: string;
  documentId: string;
  document: Document;
  sharedBy: {
    id: string;
    name: string;
  };
  sharedAt: string;
}

export interface CreateSharedSpaceInput {
  name: string;
  description?: string;
  level: SharedLevel;
  branchId?: string;
  departmentId?: string;
}

export interface UpdateSharedSpaceInput {
  name?: string;
  description?: string;
}

export interface ShareDocumentInput {
  documentId: string;
}
