import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  CreateFolderInput,
  Document,
  Folder,
  FolderContents,
  UpdateFolderInput,
} from "@/types/folder";

type FolderApiRecord = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  organizationId: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  createdBy?: {
    id: string;
    name: string;
  };
};

type DocumentApiRecord = {
  id: string;
  fileUrl: string;
  fileName: string;
  title?: string | null;
  summary?: string | null;
  documentOwner?: string | null;
  author?: string | null;
  documentType?: string | null;
  concerning?: string | null;
  purpose?: string | null;
  documentDate?: string | null;
  category?: { name?: string } | string | null;
  folderId: string;
  uploadedBy:
    | {
        id: string;
        name: string;
      }
    | string;
  createdAt: string;
  updatedAt: string;
};

type FolderContentsResponseEnvelope = ApiSuccessEnvelope<
  FolderApiRecord & {
    children: FolderApiRecord[];
    documents: DocumentApiRecord[];
    breadcrumb: Array<{ id: string; name: string }>;
  }
>;

function normalizeFolder(folder: FolderApiRecord): Folder {
  const createdBy = folder.createdBy
    ? {
        id: folder.createdBy.id,
        name: folder.createdBy.name,
      }
    : {
        id: folder.createdById ?? "",
        name: "Unknown",
      };

  return {
    id: folder.id,
    name: folder.name,
    slug: folder.slug,
    parentId: folder.parentId,
    organizationId: folder.organizationId,
    itemCount: folder.itemCount ?? 0,
    createdBy,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

function normalizeDocument(document: DocumentApiRecord): Document {
  const uploadedByName =
    typeof document.uploadedBy === "string"
      ? document.uploadedBy
      : document.uploadedBy?.name ?? "Unknown";

  return {
    id: document.id,
    fileUrl: document.fileUrl,
    fileName: document.fileName,
    title: document.title ?? null,
    summary: document.summary ?? null,
    documentOwner: document.documentOwner ?? null,
    author: document.author ?? null,
    documentType: document.documentType ?? null,
    concerning: document.concerning ?? null,
    purpose: document.purpose ?? null,
    documentDate: document.documentDate ?? null,
    category:
      typeof document.category === "string"
        ? document.category
        : document.category?.name ?? "",
    folderId: document.folderId,
    uploadedBy: uploadedByName,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

export const folderApi = {
  async createFolder(data: CreateFolderInput): Promise<Folder> {
    const response = await apiClient.post<ApiSuccessEnvelope<FolderApiRecord>>(
      "/folders",
      data,
    );

    return normalizeFolder(response.data);
  },

  async getRootFolders(): Promise<Folder[]> {
    const response = await apiClient.get<ApiSuccessEnvelope<FolderApiRecord[]>>(
      "/folders",
    );

    return response.data.map(normalizeFolder);
  },

  async getFolderContents(id: string): Promise<FolderContents> {
    const response = await apiClient.get<FolderContentsResponseEnvelope>(
      `/folders/${id}`,
    );
    const payload = response.data;

    return {
      folder: normalizeFolder(payload),
      children: payload.children.map(normalizeFolder),
      documents: payload.documents.map(normalizeDocument),
      breadcrumb: payload.breadcrumb,
    };
  },

  async updateFolder(id: string, data: UpdateFolderInput): Promise<Folder> {
    const response = await apiClient.patch<ApiSuccessEnvelope<FolderApiRecord>>(
      `/folders/${id}`,
      data,
    );

    return normalizeFolder(response.data);
  },

  async deleteFolder(id: string): Promise<Folder> {
    const response = await apiClient.delete<ApiSuccessEnvelope<FolderApiRecord>>(
      `/folders/${id}`,
    );

    return normalizeFolder(response.data);
  },
};
