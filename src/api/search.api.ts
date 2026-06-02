import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  CollectionSearchResult,
  SearchDocumentHit,
  SearchFilters,
  SearchResult,
  SharedSpaceSearchResult,
} from "@/types/search";
import type { Folder } from "@/types/folder";

type CollectionSearchApiRecord = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  documentCount: number;
};

type PaginatedApiPayload<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

type SearchApiResponse = {
  documents: {
    data: SearchDocumentHit[];
    total: number;
    page: number;
  };
  folders: {
    data: Array<Folder>;
    total: number;
  };
  collections?: {
    data: CollectionSearchApiRecord[];
    total: number;
  };
  sharedSpaces?: {
    data: SharedSpaceSearchResult[];
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

function normalizeCollection(
  item: CollectionSearchApiRecord,
): CollectionSearchResult {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description ?? null,
    documentCount: item.documentCount,
  };
}

function unwrapPaginatedCollections(
  payload: CollectionSearchApiRecord[] | PaginatedApiPayload<CollectionSearchApiRecord>,
): CollectionSearchResult[] {
  if (Array.isArray(payload)) {
    return payload.map(normalizeCollection);
  }
  return payload.data.map(normalizeCollection);
}

const emptySearchResult = (): SearchResult => ({
  documents: { data: [], total: 0, page: 1 },
  folders: { data: [], total: 0 },
  collections: { data: [], total: 0 },
  sharedSpaces: { data: [], total: 0 },
});

export const searchApi = {
  async searchCollections(query: string, limit = 8): Promise<CollectionSearchResult[]> {
    const params = new URLSearchParams({
      query,
      limit: String(limit),
      page: "1",
    });
    const response = await apiClient.get<
      ApiSuccessEnvelope<
        CollectionSearchApiRecord[] | PaginatedApiPayload<CollectionSearchApiRecord>
      >
    >(`/search/collections?${params.toString()}`);

    return unwrapPaginatedCollections(response.data);
  },

  async search(filters: SearchFilters): Promise<SearchResult> {
    const response = await apiClient.get<
      ApiSuccessEnvelope<SearchApiResponse>
    >(buildSearchPath(filters));

    const data = response.data;

    return {
      documents: data.documents ?? { data: [], total: 0, page: 1 },
      folders: data.folders ?? { data: [], total: 0 },
      collections: {
        data: (data.collections?.data ?? []).map(normalizeCollection),
        total: data.collections?.total ?? 0,
      },
      sharedSpaces: {
        data: data.sharedSpaces?.data ?? [],
        total: data.sharedSpaces?.total ?? 0,
      },
    };
  },

  async globalQuickSearch(query: string, limit = 5): Promise<SearchResult> {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return emptySearchResult();
    }

    return this.search({
      query: trimmed,
      page: 1,
      limit,
    });
  },
};
