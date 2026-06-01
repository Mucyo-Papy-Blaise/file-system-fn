import type { Document } from "./document";
import type { SharedLevel } from "./shared-space";

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  isShared: boolean;
  level?: SharedLevel | null;
  branchId?: string | null;
  departmentId?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  organizationId: string;
  documentCount: number;
  documents: Document[];
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  isShared?: boolean;
  level?: SharedLevel;
  branchId?: string;
  departmentId?: string;
}

export interface CollectionsListResult {
  private: Collection[];
  shared: Collection[];
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
}

export interface AddDocumentInput {
  documentId: string;
}
