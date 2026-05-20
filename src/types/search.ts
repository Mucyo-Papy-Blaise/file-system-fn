import type { Document } from "./document";
import type { Folder } from "./folder";

export interface SearchResult {
  documents: {
    data: Document[];
    total: number;
    page: number;
  };
  folders: {
    data: Folder[];
    total: number;
  };
}

export interface CollectionSearchResult {
  id: string;
  name: string;
  description?: string | null;
  documentCount: number;
}

export interface SearchFilters {
  query: string;
  categoryId?: string;
  documentType?: string;
  folderId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
