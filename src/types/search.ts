import type { Folder } from "./folder";

/** Document row returned by global search (includes content snippet, not full extractedText). */
export interface SearchDocumentHit {
  id: string;
  title: string | null;
  fileName: string;
  fileUrl: string;
  documentType?: string | null;
  concerning?: string | null;
  summary?: string | null;
  textSnippet?: string | null;
  category: { id: string; name: string } | null;
  folder: { id: string; name: string } | null;
  uploadedBy: { id: string; email: string; name: string };
  createdAt: string;
}

export interface SearchResult {
  documents: {
    data: SearchDocumentHit[];
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
  slug: string;
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
