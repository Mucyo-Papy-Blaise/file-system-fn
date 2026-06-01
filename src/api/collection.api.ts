import { apiClient } from "@/api/api-client";
import { normalizeTrashItem } from "@/api/trash.api";
import type { TrashItem } from "@/types/trash";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  AddDocumentInput,
  Collection,
  CollectionsListResult,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "@/types/collection";
import type { SharedLevel } from "@/types/shared-space";
import type { Document } from "@/types/document";

type CreatedByApiRecord = {
  id: string;
  email: string;
  name: string;
};

type CategoryApiRecord = {
  id: string;
  name: string;
};

type FolderApiRecord = {
  id: string;
  name: string;
};

type UploadedByApiRecord = {
  id: string;
  email: string;
  name: string;
};

type DocumentInCollectionApiRecord = {
  id: string;
  fileName: string;
  fileUrl: string;
  extractedText: string;
  title: string;
  summary: string;
  documentOwner?: string | null;
  author?: string | null;
  documentType?: string | null;
  concerning?: string | null;
  purpose?: string | null;
  documentDate?: string | null;
  processingStatus?: string | null;
  createdAt: string;
  updatedAt: string;
  category: CategoryApiRecord;
  folder: FolderApiRecord;
  uploadedBy: UploadedByApiRecord;
  organizationId: string;
};

type CollectionDocumentApiRecord = {
  document: DocumentInCollectionApiRecord;
};

type CollectionApiRecord = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  isShared?: boolean;
  level?: SharedLevel | null;
  branchId?: string | null;
  departmentId?: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  createdBy?: CreatedByApiRecord;
  documentCount?: number;
  documents?: CollectionDocumentApiRecord[];
  _count?: {
    documents: number;
  };
};

type CollectionsListApiResponse = {
  private: CollectionApiRecord[];
  shared: CollectionApiRecord[];
};

function normalizeCollection(collection: CollectionApiRecord): Collection {
  const createdBy = collection.createdBy
    ? {
        id: collection.createdBy.id,
        name: collection.createdBy.name,
      }
    : {
        id: collection.createdById ?? "",
        name: "Unknown",
      };

  // Handle both documentCount (from findAll) and _count.documents (from list)
  const documentCount =
    collection.documentCount ?? collection._count?.documents ?? 0;

  // Transform nested documents from collectionDocument structure
  const documents: Document[] = (collection.documents ?? []).map((cd) => {
    const doc = cd.document;
    return {
      id: doc.id,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      extractedText: doc.extractedText,
      title: doc.title,
      summary: doc.summary,
      processingStatus: (doc.processingStatus ?? "").toLowerCase() as Document["processingStatus"],
      documentOwner: doc.documentOwner ?? null,
      author: doc.author ?? null,
      documentType: doc.documentType ?? null,
      concerning: doc.concerning ?? null,
      purpose: doc.purpose ?? null,
      documentDate: doc.documentDate ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      category: doc.category,
      folder: doc.folder,
      uploadedBy: {
        id: doc.uploadedBy.id,
        name: doc.uploadedBy.name,
      },
      organizationId: doc.organizationId,
    };
  });

  return {
    id: collection.id,
    slug: collection.slug,
    name: collection.name,
    description: collection.description ?? null,
    isShared: collection.isShared ?? false,
    level: collection.level ?? null,
    branchId: collection.branchId ?? null,
    departmentId: collection.departmentId ?? null,
    organizationId: collection.organizationId,
    documentCount,
    createdBy,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    documents,
  };
}

export const collectionApi = {
  async createCollection(data: CreateCollectionInput): Promise<Collection> {
    const response = await apiClient.post<ApiSuccessEnvelope<CollectionApiRecord>>(
      "/collections",
      data,
    );

    return normalizeCollection(response.data);
  },

  async getCollections(): Promise<CollectionsListResult> {
    const response = await apiClient.get<
      ApiSuccessEnvelope<CollectionsListApiResponse>
    >("/collections");

    return {
      private: response.data.private.map(normalizeCollection),
      shared: response.data.shared.map(normalizeCollection),
    };
  },

  async getCollectionBySlug(slug: string): Promise<Collection> {
    const response = await apiClient.get<ApiSuccessEnvelope<CollectionApiRecord>>(
      `/collections/${encodeURIComponent(slug)}`,
    );

    return normalizeCollection(response.data);
  },

  async updateCollection(
    slug: string,
    data: UpdateCollectionInput,
  ): Promise<Collection> {
    const response = await apiClient.patch<ApiSuccessEnvelope<CollectionApiRecord>>(
      `/collections/${encodeURIComponent(slug)}`,
      data,
    );

    return normalizeCollection(response.data);
  },

  async deleteCollection(slug: string): Promise<TrashItem> {
    const response = await apiClient.delete<ApiSuccessEnvelope<Parameters<typeof normalizeTrashItem>[0]>>(
      `/collections/${encodeURIComponent(slug)}`,
    );

    return normalizeTrashItem(response.data);
  },

  async addDocument(
    collectionSlug: string,
    documentId: string,
  ): Promise<Collection> {
    const response = await apiClient.post<ApiSuccessEnvelope<CollectionApiRecord>>(
      `/collections/${encodeURIComponent(collectionSlug)}/documents`,
      { documentId },
    );

    return normalizeCollection(response.data);
  },

  async removeDocument(
    collectionSlug: string,
    documentId: string,
  ): Promise<Collection> {
    const response = await apiClient.delete<ApiSuccessEnvelope<CollectionApiRecord>>(
      `/collections/${encodeURIComponent(collectionSlug)}/documents/${documentId}`,
    );

    return normalizeCollection(response.data);
  },
};
