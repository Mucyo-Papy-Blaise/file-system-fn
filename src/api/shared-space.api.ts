import { apiClient } from "@/api/api-client";
import { normalizeTrashItem } from "@/api/trash.api";
import type { TrashItem } from "@/types/trash";
import type { ApiSuccessEnvelope } from "@/types/http";
import type { Document } from "@/types/document";
import type {
  CreateSharedSpaceInput,
  SharedLevel,
  SharedSpace,
  SharedSpaceDocument,
  UpdateSharedSpaceInput,
} from "@/types/shared-space";

type CreatedByApiRecord = {
  id: string;
  email: string;
  name: string;
};

type CategoryApiRecord = {
  id: string;
  name: string;
};

type UserRefApiRecord = {
  id: string;
  email?: string;
  name: string;
};

type SharedSpaceDocumentApiRecord = {
  sharedSpaceId?: string;
  documentId: string;
  fileName: string;
  fileUrl: string;
  title: string | null;
  category: CategoryApiRecord | null;
  uploadedBy: UserRefApiRecord;
  sharedBy: UserRefApiRecord;
  sharedAt: string;
};

type SharedSpaceApiRecord = {
  id: string;
  name: string;
  description?: string | null;
  level: SharedLevel;
  organizationId: string;
  branchId?: string | null;
  departmentId?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  createdBy?: CreatedByApiRecord;
  createdByName?: string;
  documentCount?: number;
  documents?: SharedSpaceDocumentApiRecord[];
  _count?: {
    documents: number;
  };
};

function mapDocumentFromSharedEntry(
  entry: SharedSpaceDocumentApiRecord,
  organizationId: string,
): Document {
  return {
    id: entry.documentId,
    fileName: entry.fileName,
    fileUrl: entry.fileUrl,
    extractedText: "",
    title: entry.title ?? entry.fileName,
    summary: "",
    processingStatus: "confirmed",
    category: entry.category ?? { id: "", name: "Uncategorized" },
    folder: { id: "", name: "" },
    uploadedBy: {
      id: entry.uploadedBy.id,
      name: entry.uploadedBy.name,
    },
    organizationId,
    createdAt: entry.sharedAt,
    updatedAt: entry.sharedAt,
  };
}

function normalizeSharedSpaceDocument(
  entry: SharedSpaceDocumentApiRecord,
  spaceId: string,
  organizationId: string,
): SharedSpaceDocument {
  return {
    sharedSpaceId: entry.sharedSpaceId ?? spaceId,
    documentId: entry.documentId,
    document: mapDocumentFromSharedEntry(entry, organizationId),
    sharedBy: {
      id: entry.sharedBy.id,
      name: entry.sharedBy.name,
    },
    sharedAt:
      typeof entry.sharedAt === "string"
        ? entry.sharedAt
        : new Date(entry.sharedAt).toISOString(),
  };
}

function normalizeSharedSpace(space: SharedSpaceApiRecord): SharedSpace {
  const createdBy = space.createdBy
    ? {
        id: space.createdBy.id,
        name: space.createdBy.name,
      }
    : {
        id: space.createdById ?? "",
        name: space.createdByName ?? "Unknown",
      };

  const documentCount =
    space.documentCount ?? space._count?.documents ?? space.documents?.length ?? 0;

  const documents = (space.documents ?? []).map((entry) =>
    normalizeSharedSpaceDocument(entry, space.id, space.organizationId),
  );

  return {
    id: space.id,
    name: space.name,
    description: space.description ?? null,
    level: space.level,
    organizationId: space.organizationId,
    branchId: space.branchId ?? null,
    departmentId: space.departmentId ?? null,
    createdBy,
    createdAt: space.createdAt,
    updatedAt: space.updatedAt,
    documentCount,
    documents,
  };
}

export const sharedSpaceApi = {
  async createSharedSpace(data: CreateSharedSpaceInput): Promise<SharedSpace> {
    const response = await apiClient.post<ApiSuccessEnvelope<SharedSpaceApiRecord>>(
      "/shared-spaces",
      data,
    );

    return normalizeSharedSpace(response.data);
  },

  async getSharedSpaces(): Promise<SharedSpace[]> {
    const response = await apiClient.get<ApiSuccessEnvelope<SharedSpaceApiRecord[]>>(
      "/shared-spaces",
    );

    return response.data.map(normalizeSharedSpace);
  },

  async getSharedSpaceById(id: string): Promise<SharedSpace> {
    const response = await apiClient.get<ApiSuccessEnvelope<SharedSpaceApiRecord>>(
      `/shared-spaces/${encodeURIComponent(id)}`,
    );

    return normalizeSharedSpace(response.data);
  },

  async updateSharedSpace(
    id: string,
    data: UpdateSharedSpaceInput,
  ): Promise<SharedSpace> {
    const response = await apiClient.patch<ApiSuccessEnvelope<SharedSpaceApiRecord>>(
      `/shared-spaces/${encodeURIComponent(id)}`,
      data,
    );

    return normalizeSharedSpace(response.data);
  },

  async deleteSharedSpace(id: string): Promise<TrashItem> {
    const response = await apiClient.delete<ApiSuccessEnvelope<Parameters<typeof normalizeTrashItem>[0]>>(
      `/shared-spaces/${encodeURIComponent(id)}`,
    );

    return normalizeTrashItem(response.data);
  },

  async shareDocument(spaceId: string, documentId: string): Promise<SharedSpace> {
    const response = await apiClient.post<ApiSuccessEnvelope<SharedSpaceApiRecord>>(
      `/shared-spaces/${encodeURIComponent(spaceId)}/documents`,
      { documentId },
    );

    return normalizeSharedSpace(response.data);
  },

  async removeDocument(spaceId: string, documentId: string): Promise<SharedSpace> {
    const response = await apiClient.delete<ApiSuccessEnvelope<SharedSpaceApiRecord>>(
      `/shared-spaces/${encodeURIComponent(spaceId)}/documents/${encodeURIComponent(documentId)}`,
    );

    return normalizeSharedSpace(response.data);
  },

  async replaceDocument(
    spaceId: string,
    documentId: string,
    newDocumentId: string,
  ): Promise<SharedSpace> {
    const response = await apiClient.patch<ApiSuccessEnvelope<SharedSpaceApiRecord>>(
      `/shared-spaces/${encodeURIComponent(spaceId)}/documents/${encodeURIComponent(documentId)}/replace`,
      { newDocumentId },
    );

    return normalizeSharedSpace(response.data);
  },
};
