"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useGetDocuments } from "@/lib/hooks/useDocuments";
import { useGetCategories } from "@/lib/hooks/useCategories";
import { DocumentCard } from "@/components/documents/DocumentCard";
import type { DocumentFilters } from "@/types/document";

export default function DocumentsPage() {
  const [filters, setFilters] = useState<DocumentFilters>({
    search: "",
    categoryId: undefined,
    page: 1,
    limit: 20,
  });

  const [search, setSearch] = useState("");
  const { documents, pagination, isLoading } = useGetDocuments(filters);
  const { categories } = useGetCategories();

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleCategoryFilter = (categoryId: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      categoryId,
      page: 1,
    }));
  };

  const handleLoadMore = () => {
    setFilters((prev) => ({
      ...prev,
      page: (prev.page || 1) + 1,
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <p className="mt-1 text-sm text-secondary">
          Manage and organize your uploaded documents
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-2xl border border-default bg-surface p-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] py-2 pl-10 pr-4 text-foreground placeholder-secondary focus:border-primary focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-secondary" />
          <select
            value={filters.categoryId || ""}
            onChange={(e) =>
              handleCategoryFilter(e.target.value || undefined)
            }
            className="flex-1 rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {isLoading && documents.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-[var(--color-bg-secondary)]"
            />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-default bg-[var(--color-bg-secondary)] p-12 text-center">
          <h2 className="text-lg font-semibold text-foreground">No documents found</h2>
          <p className="mt-2 text-sm text-secondary">
            {search || filters.categoryId
              ? "Try adjusting your filters"
              : "Upload your first document to get started"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>

          {/* Load More */}
          {pagination && pagination.total > documents.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="rounded-2xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div className="text-center text-xs text-secondary">
          Showing {documents.length} of {pagination.total} documents
        </div>
      )}
    </div>
  );
}
