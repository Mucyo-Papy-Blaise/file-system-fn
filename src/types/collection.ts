import type { Document } from "./document";

export interface Collection {
  id: string;
  name: string;
  description?: string | null;
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
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
}

export interface AddDocumentInput {
  documentId: string;
}
