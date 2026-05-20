import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  CollectionSearchResult,
  SearchFilters,
  SearchResult,
} from "@/types/search";
import type { Folder } from "@/types/folder";
import type { Document } from "@/types/document";

type CollectionSearchApiRecord = {
  id: string;
  name: string;
  description?: string | null;
  documentCount: number;
};

type SearchApiResponse = {
  documents: {
    data: Document[];
    total: number;
    page: number;
  };
  folders: {
    data: Array<Folder>;
    total: number;
  };
};

function buildSearchPath(filters: SearchFilters): string {
  const params = new URLSearchParams();

  params.set("query", filters.query);

  if (filters.categoryId) {
    params.set("categoryId", filters.categoryId);
  }

  if (filters.documentType) {
    params.set("documentType", filters.documentType);
  }

  if (filters.folderId) {
    params.set("folderId", filters.folderId);
  }

  if (filters.dateFrom) {
    params.set("dateFrom", filters.dateFrom);
  }

  if (filters.dateTo) {
    params.set("dateTo", filters.dateTo);
  }

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : "/search";
}

export const searchApi = {
  async searchCollections(query: string): Promise<CollectionSearchResult[]> {
    const response = await apiClient.get<
      ApiSuccessEnvelope<CollectionSearchApiRecord[]>
    >(`/search/collections?query=${encodeURIComponent(query)}`);

    return response.data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? null,
      documentCount: item.documentCount,
    }));
  },

  async search(filters: SearchFilters): Promise<SearchResult> {
    const response = await apiClient.get<
      ApiSuccessEnvelope<SearchApiResponse>
    >(buildSearchPath(filters));

    return response.data;
  },
};
