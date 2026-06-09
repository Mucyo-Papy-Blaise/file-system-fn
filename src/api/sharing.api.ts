import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  CreateShareInput,
  DocumentShare,
  ReplyShareInput,
  SharedFolderSummary,
  ShareReply,
  ShareUser,
} from "@/types/sharing";
import type { Document } from "@/types/document";
import type { Collection } from "@/types/collection";
import { Role } from "@/types/enum";
import { SharedLevel } from "@/types/shared-space";

type ShareUserApiRecord = {
  id: string;
  name: string;
  role: Role;
};

type ShareReplyApiRecord = {
  id: string;
  message: string;
  createdAt: string;
  user: ShareUserApiRecord;
};

export type DocumentShareApiRecord = {
  id: string;
  message?: string | null;
  isRead: boolean;
  expiresAt: string;
  createdAt: string;
  sharedBy: ShareUserApiRecord;
  sharedTo: ShareUserApiRecord;
  document?: {
    id: string;
    fileName: string;
    fileUrl: string;
    extractedText?: string;
    title: string;
    summary: string;
    processingStatus?: string | null;
    documentOwner?: string | null;
    author?: string | null;
    documentType?: string | null;
    concerning?: string | null;
    purpose?: string | null;
    documentDate?: string | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    category: { id: string; name: string };
    folder: { id: string; name: string };
    uploadedBy: { id: string; name: string };
  } | null;
  collection?: {
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
    createdBy?: { id: string; name: string };
    createdById?: string;
    documentCount?: number;
    _count?: { documents: number };
    documents?: Array<{
      document: NonNullable<DocumentShareApiRecord["document"]>;
    }>;
  } | null;
  folder?: {
    id: string;
    slug: string;
    name: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: { id: string; name: string };
    createdById?: string;
    documents?: NonNullable<DocumentShareApiRecord["document"]>[];
  } | null;
  replies?: ShareReplyApiRecord[];
};

function normalizeShareUser(user: ShareUserApiRecord): ShareUser {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
  };
}

function normalizeShareReply(reply: ShareReplyApiRecord): ShareReply {
  return {
    id: reply.id,
    message: reply.message,
    createdAt: reply.createdAt,
    user: normalizeShareUser(reply.user),
  };
}

function normalizeDocument(doc: NonNullable<DocumentShareApiRecord["document"]>): Document {
  return {
    id: doc.id,
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    extractedText: doc.extractedText ?? "",
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
    uploadedBy: doc.uploadedBy,
    organizationId: doc.organizationId,
  };
}

function normalizeCollection(
  collection: NonNullable<DocumentShareApiRecord["collection"]>,
): Collection {
  const createdBy = collection.createdBy
    ? { id: collection.createdBy.id, name: collection.createdBy.name }
    : { id: collection.createdById ?? "", name: "Unknown" };

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
    documentCount:
      collection.documentCount ?? collection._count?.documents ?? 0,
    createdBy,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    documents: (collection.documents ?? []).map((entry) =>
      normalizeDocument(entry.document),
    ),
  };
}

function normalizeFolder(
  folder: NonNullable<DocumentShareApiRecord["folder"]>,
): SharedFolderSummary {
  return {
    id: folder.id,
    slug: folder.slug,
    name: folder.name,
    organizationId: folder.organizationId,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
    createdBy: folder.createdBy
      ? { id: folder.createdBy.id, name: folder.createdBy.name }
      : { id: folder.createdById ?? "", name: "Unknown" },
    documents: (folder.documents ?? []).map(normalizeDocument),
  };
}

export function normalizeShare(share: DocumentShareApiRecord): DocumentShare {
  return {
    id: share.id,
    message: share.message ?? null,
    isRead: share.isRead,
    expiresAt: share.expiresAt,
    createdAt: share.createdAt,
    sharedBy: normalizeShareUser(share.sharedBy),
    sharedTo: normalizeShareUser(share.sharedTo),
    document: share.document ? normalizeDocument(share.document) : undefined,
    collection: share.collection ? normalizeCollection(share.collection) : undefined,
    folder: share.folder ? normalizeFolder(share.folder) : undefined,
    replies: (share.replies ?? []).map(normalizeShareReply),
  };
}

export const sharingApi = {
  async shareDocument(data: CreateShareInput): Promise<DocumentShare[]> {
    const response = await apiClient.post<
      ApiSuccessEnvelope<DocumentShareApiRecord[]>,
      CreateShareInput
    >("/sharing", data);

    const items = Array.isArray(response.data) ? response.data : [response.data];
    return items.map(normalizeShare);
  },

  async getInbox(): Promise<DocumentShare[]> {
    const response = await apiClient.get<ApiSuccessEnvelope<DocumentShareApiRecord[]>>(
      "/sharing/inbox",
    );

    return response.data.map(normalizeShare);
  },

  async getShareById(id: string): Promise<DocumentShare> {
    const response = await apiClient.get<ApiSuccessEnvelope<DocumentShareApiRecord>>(
      `/sharing/${encodeURIComponent(id)}`,
    );

    return normalizeShare(response.data);
  },

  async getSent(): Promise<DocumentShare[]> {
    const response = await apiClient.get<ApiSuccessEnvelope<DocumentShareApiRecord[]>>(
      "/sharing/sent",
    );

    return response.data.map(normalizeShare);
  },

  async replyToShare(id: string, data: ReplyShareInput): Promise<DocumentShare> {
    const response = await apiClient.post<
      ApiSuccessEnvelope<DocumentShareApiRecord>,
      ReplyShareInput
    >(`/sharing/${encodeURIComponent(id)}/reply`, data);

    return normalizeShare(response.data);
  },

  async markAsRead(id: string): Promise<DocumentShare> {
    const response = await apiClient.patch<ApiSuccessEnvelope<DocumentShareApiRecord>>(
      `/sharing/${encodeURIComponent(id)}/read`,
    );

    return normalizeShare(response.data);
  },

  async deleteShare(id: string): Promise<DocumentShare> {
    const response = await apiClient.delete<ApiSuccessEnvelope<DocumentShareApiRecord>>(
      `/sharing/${encodeURIComponent(id)}`,
    );

    return normalizeShare(response.data);
  },
};
