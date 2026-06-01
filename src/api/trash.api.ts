import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type { TrashItem } from "@/types/trash";
import { TrashItemType } from "@/types/trash";

type TrashItemApiRecord = {
  id: string;
  type: TrashItemType;
  name: string;
  itemCount: number;
  deletedAt?: string;
  createdAt?: string;
  expiresAt: string;
  daysRemaining?: number;
  documentId?: string | null;
  folderId?: string | null;
  collectionId?: string | null;
  sharedSpaceId?: string | null;
};

function normalizeTrashItem(record: TrashItemApiRecord): TrashItem {
  return {
    id: record.id,
    type: record.type,
    name: record.name,
    itemCount: record.itemCount ?? 0,
    deletedAt: record.deletedAt ?? record.createdAt ?? new Date().toISOString(),
    expiresAt: record.expiresAt,
    daysRemaining: record.daysRemaining,
    documentId: record.documentId ?? null,
    folderId: record.folderId ?? null,
    collectionId: record.collectionId ?? null,
    sharedSpaceId: record.sharedSpaceId ?? null,
  };
}

export const trashApi = {
  async getTrashItems(): Promise<TrashItem[]> {
    const response = await apiClient.get<ApiSuccessEnvelope<TrashItemApiRecord[]>>(
      "/trash",
    );

    return response.data.map(normalizeTrashItem);
  },

  async restore(id: string): Promise<unknown> {
    const response = await apiClient.post<ApiSuccessEnvelope<unknown>>(
      `/trash/${encodeURIComponent(id)}/restore`,
    );

    return response.data;
  },

  async permanentDelete(id: string): Promise<{ id: string; deleted: boolean }> {
    const response = await apiClient.delete<
      ApiSuccessEnvelope<{ id: string; deleted: boolean }>
    >(`/trash/${encodeURIComponent(id)}`);

    return response.data;
  },

  async emptyTrash(): Promise<{ count: number }> {
    const response = await apiClient.delete<ApiSuccessEnvelope<{ count: number }>>(
      "/trash",
    );

    return response.data;
  },
};

export { normalizeTrashItem };
