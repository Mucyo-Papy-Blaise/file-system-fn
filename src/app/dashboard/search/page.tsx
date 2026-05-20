"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, Eye, Filter, Search } from "lucide-react";
import { useGetCategories } from "@/lib/hooks/useCategories";
import { useGetRootFolders } from "@/lib/hooks/useFolders";
import { useSearch } from "@/lib/hooks/useSearch";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import type { SearchFilters } from "@/types/search";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export default function DashboardSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    categoryId: undefined,
    documentType: undefined,
    folderId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    page: 1,
    limit: 10,
  });

  const { searchResult, isLoading } = useSearch(filters);
  const { categories } = useGetCategories();
  const { folders } = useGetRootFolders();

  const handleQueryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      query: value,
      page: 1,
    }));
  };

  const handleCategoryIdChange = (categoryId: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      categoryId,
      page: 1,
    }));
  };

  const handleDocumentTypeChange = (documentType: string) => {
    setFilters((prev) => ({
      ...prev,
      documentType: documentType || undefined,
      page: 1,
    }));
  };

  const handleFolderIdChange = (folderId: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      folderId,
      page: 1,
    }));
  };

  const handleDateFromChange = (dateFrom: string) => {
    setFilters((prev) => ({
      ...prev,
      dateFrom: dateFrom || undefined,
      page: 1,
    }));
  };

  const handleDateToChange = (dateTo: string) => {
    setFilters((prev) => ({
      ...prev,
      dateTo: dateTo || undefined,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      categoryId: undefined,
      documentType: undefined,
      folderId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const documents = searchResult?.documents.data ?? [];
  const foldersResult = searchResult?.folders.data ?? [];
  const documentTotal = searchResult?.documents.total ?? 0;
  const folderTotal = searchResult?.folders.total ?? 0;
  const currentPage = filters.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(documentTotal / (filters.limit ?? 10)));
  const showSearchResults = filters.query.trim().length >= 2;

  const searchTitle = useMemo(() => {
    if (!showSearchResults) {
      return "Enter at least 2 characters to search documents and folders.";
    }
    if (isLoading) {
      return "Searching...";
    }
    return `Found ${documentTotal} documents and ${folderTotal} folders`;
  }, [documentTotal, folderTotal, isLoading, showSearchResults]);

  const handleOpenDocument = (doc: { fileUrl: string }) => {
    if (!doc.fileUrl) return;
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadDocument = (doc: { fileUrl: string; fileName: string }) => {
    if (!doc.fileUrl) return;

    const link = window.document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Search</h1>
        <p className="mt-1 text-sm text-secondary">
          Find documents and folders across your workspace.
        </p>
      </div>

      <section className="space-y-4 rounded-3xl border border-default bg-surface p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search documents and folders..."
            value={filters.query}
            onChange={(event) => handleQueryChange(event.target.value)}
            className="w-full rounded-3xl border border-default bg-[var(--color-bg-secondary)] py-3 pl-12 pr-4 text-foreground placeholder-secondary focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={filters.categoryId ?? ""}
                onChange={(event) => handleCategoryIdChange(event.target.value || undefined)}
                className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Document Type</label>
              <input
                type="text"
                placeholder="Enter document type"
                value={filters.documentType ?? ""}
                onChange={(event) => handleDocumentTypeChange(event.target.value)}
                className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground placeholder-secondary focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Folder</label>
              <select
                value={filters.folderId ?? ""}
                onChange={(event) => handleFolderIdChange(event.target.value || undefined)}
                className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Folders</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date From</label>
              <input
                type="date"
                value={filters.dateFrom ?? ""}
                onChange={(event) => handleDateFromChange(event.target.value)}
                className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date To</label>
              <input
                type="date"
                value={filters.dateTo ?? ""}
                onChange={(event) => handleDateToChange(event.target.value)}
                className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-default bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
              >
                <Filter className="h-4 w-4" />
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {showSearchResults ? (
        <section className="space-y-6">
          <div className="rounded-3xl border border-default bg-surface p-5 shadow-sm">
            <p className="text-sm font-medium text-foreground">{searchTitle}</p>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-default bg-surface p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Documents</h2>
                  <p className="text-sm text-secondary">{documentTotal} items found</p>
                </div>
                <Badge label={`${documentTotal}`} variant="category" />
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <LoadingSkeleton key={index} height={54} rounded="1rem" />
                  ))}
                </div>
              ) : documents.length === 0 ? (
                <EmptyState
                  title="No documents found"
                  description="Adjust your search or filters to see matching documents."
                  actionLabel="Clear filters"
                  onAction={handleClearFilters}
                />
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-default bg-surface">
                  <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                    <thead className="bg-[var(--color-bg-secondary)] text-secondary">
                      <tr>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Concerning</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Folder</th>
                        <th className="px-4 py-3">Uploaded By</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((document) => (
                        <tr
                          key={document.id}
                          className="border-t border-default hover:bg-[var(--color-bg-secondary)]"
                        >
                          <td className="px-4 py-4 text-foreground">{document.title ?? document.fileName}</td>
                          <td className="px-4 py-4 text-secondary">{document.documentType ?? "—"}</td>
                          <td className="px-4 py-4 text-secondary">{document.concerning ?? "—"}</td>
                          <td className="px-4 py-4 text-secondary">{document?.category?.name}</td>
                          <td className="px-4 py-4 text-secondary">{document.folder.name}</td>
                          <td className="px-4 py-4 text-secondary">{document.uploadedBy.name}</td>
                          <td className="px-4 py-4 text-secondary">{new Date(document.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenDocument(document)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-default bg-[var(--color-bg-secondary)] text-secondary transition hover:bg-[var(--color-bg-tertiary)]"
                                aria-label="Preview document"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadDocument(document)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-default bg-[var(--color-bg-secondary)] text-secondary transition hover:bg-[var(--color-bg-tertiary)]"
                                aria-label="Download document"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {documentTotal > 0 && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-secondary">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1 || isLoading}
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className="inline-flex items-center gap-2 rounded-2xl border border-default bg-surface px-4 py-2 text-sm text-foreground transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages || isLoading}
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className="inline-flex items-center gap-2 rounded-2xl border border-default bg-surface px-4 py-2 text-sm text-foreground transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-default bg-surface p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Folders</h2>
                  <p className="text-sm text-secondary">{folderTotal} items found</p>
                </div>
                <Badge label={`${folderTotal}`} variant="category" />
              </div>

              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, index) => (
                    <LoadingSkeleton key={index} height={120} rounded="1.5rem" />
                  ))}
                </div>
              ) : foldersResult.length === 0 ? (
                <EmptyState
                  title="No folders found"
                  description="Try changing your search query or filters to locate folders."
                  actionLabel="Clear filters"
                  onAction={handleClearFilters}
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {foldersResult.map((folder) => (
                    <Link
                      key={folder.id}
                      href={`/dashboard/folders/${folder.id}`}
                      className="group rounded-3xl border border-default bg-[var(--color-bg-secondary)] p-5 transition hover:border-primary"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-foreground">{folder.name}</p>
                          <p className="mt-2 text-sm text-secondary">
                            Created by {folder.createdBy.name}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-primary-subtle px-3 py-2 text-sm font-semibold text-primary">
                          {folder.itemCount} items
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-secondary">Created at {new Date(folder.createdAt).toLocaleDateString()}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-3xl border border-default bg-surface p-10 text-center text-sm text-secondary">
          Enter at least 2 characters above to search documents and folders.
        </div>
      )}
    </div>
  );
}
