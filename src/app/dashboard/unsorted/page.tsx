"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, RefreshCcw } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { SortBar } from "@/components/ui/SortBar";
import { DocumentDetails } from "@/components/documents/DocumentDetails";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { useGetInbox, useDeleteDocument } from "@/lib/hooks/useDocuments";
import { toast } from "sonner";
import type { SortOption, Document } from "@/types/document";

export default function DashboardUnsortedPage() {
  const { documents, isLoading } = useGetInbox();
  const deleteDocument = useDeleteDocument();

  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"single" | "multiple" | null>(
    null,
  );
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );

  // Refs for checkboxes to handle indeterminate state
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const processingCount = documents.filter(
    (d) => d.processingStatus === "processing",
  ).length;
  const readyCount = documents.filter(
    (d) => d.processingStatus === "ready",
  ).length;
  const confirmedCount = documents.filter(
    (d) => d.processingStatus === "confirmed",
  ).length;

  const sortedDocuments = useMemo(() => {
    const items = [...documents];
    if (sortBy === "name_asc" || sortBy === "name_desc") {
      items.sort((left, right) => left.fileName.localeCompare(right.fileName));
      if (sortBy === "name_desc") items.reverse();
      return items;
    }
    items.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() -
        new Date(right.createdAt).getTime(),
    );
    if (sortBy === "date_desc") items.reverse();
    return items;
  }, [documents, sortBy]);

  const selectedDocument = documents.find((d) => d.id === selectedDocumentId);
  const allSelected =
    documents.length > 0 && selectedIds.size === documents.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  // Update indeterminate state on checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(documents.map((d) => d.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newIds = new Set(selectedIds);
    if (newIds.has(id)) {
      newIds.delete(id);
    } else {
      newIds.add(id);
    }
    setSelectedIds(newIds);
  };

  const handleOpenDetails = (document: Document) => {
    setSelectedDocumentId(document.id);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleDeleteSingle = (document: Document) => {
    setDocumentToDelete(document);
    setDeleteMode("single");
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteMode === "single" && documentToDelete) {
      try {
        await deleteDocument.mutateAsync(documentToDelete.id);
        toast.success("Document deleted successfully");
        setSelectedIds((prev) => {
          const newIds = new Set(prev);
          newIds.delete(documentToDelete.id);
          return newIds;
        });
      } catch {
        toast.error("Failed to delete document");
      }
    } else if (deleteMode === "multiple") {
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) => deleteDocument.mutateAsync(id)),
        );
        toast.success(`${selectedIds.size} documents deleted successfully`);
        setSelectedIds(new Set());
      } catch {
        toast.error("Failed to delete documents");
      }
    }
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
    setDeleteMode(null);
  };

  const handleDeleteAll = () => {
    setDeleteMode("multiple");
    setDeleteModalOpen(true);
  };

  const deleteConfirmationText =
    deleteMode === "multiple"
      ? `${selectedIds.size} documents`
      : documentToDelete?.fileName ?? "document";

  function getProcessingStatusBadge(status: string) {
    switch (status) {
      case "processing":
        return (
          <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
            Processing
          </span>
        );
      case "ready":
        return (
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            Ready
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            Confirmed
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Unsorted Documents
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Uncategorized files waiting to be organized.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded bg-surface px-4 py-3 text-sm text-foreground shadow-sm flex items-center gap-5">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">
              Total
            </p>
            <p className="font-semibold text-foreground">{documents.length}</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <SortBar sortBy={sortBy} onChange={setSortBy} />

      <div className="flex gap-3 flex-wrap">
        <div className="rounded px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium">
          {processingCount} processing
        </div>
        <div className="rounded px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium">
          {readyCount} ready for review
        </div>
        <div className="rounded px-4 py-2 bg-green-100 text-green-800 text-sm font-medium">
          {confirmedCount} confirmed
        </div>
      </div>

      {documents.length > 0 && (
        <div className="mt-2">
          <div className="h-2 w-full rounded-full bg-[var(--color-bg-tertiary)]">
            <div
              className="h-2 rounded-full bg-primary"
              style={{
                width: `${Math.round(((readyCount + confirmedCount) / documents.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <LoadingSkeleton height={60} rounded="0.5rem" />
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          title="No unsorted documents"
          description="All your documents are organized!"
          actionLabel="View all documents"
          onAction={() => window.location.assign("/dashboard/documents")}
        />
      ) : (
        <>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-4 rounded-lg bg-primary/10 border border-primary/20 p-4">
              <span className="text-sm font-medium text-foreground">
                {selectedIds.size} selected
              </span>
              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={deleteDocument.isLoading}
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </button>
            </div>
          )}

          <div className="rounded-lg border border-default bg-surface overflow-hidden">
            {/* Header */}
            <div className="grid items-center gap-4 border-b border-default px-4 py-4 text-sm font-semibold text-secondary bg-[var(--color-bg-secondary)] md:grid-cols-[40px_minmax(280px,1.5fr)_120px_120px_140px_120px]">
              <div className="flex items-center">
                <input
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="rounded border-default"
                />
              </div>
              <div>File Name</div>
              <div>Status</div>
              <div>Category</div>
              <div>Updated</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Rows */}
            {sortedDocuments.map((document) => {
              const isSelected = selectedIds.has(document.id);
              const formattedDate = new Date(
                document.updatedAt || document.createdAt,
              ).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={document.id}
                  className="grid items-center gap-4 border-b border-default px-4 py-4 text-sm text-foreground hover:bg-[var(--color-bg-secondary)] transition md:grid-cols-[40px_minmax(280px,1.5fr)_120px_120px_140px_120px]"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(document.id)}
                      className="rounded border-default"
                    />
                  </div>
                  <div className="truncate">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(document)}
                      className="text-left font-semibold text-foreground hover:text-primary transition truncate"
                    >
                      {document.title || document.fileName}
                    </button>
                  </div>
                  <div>
                    {getProcessingStatusBadge(document.processingStatus)}
                  </div>
                  <div className="truncate text-secondary">
                    {document.category?.name ?? "—"}
                  </div>
                  <div className="text-secondary">{formattedDate}</div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(document)}
                      className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-semibold text-foreground bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSingle(document)}
                      disabled={deleteDocument.isLoading}
                      className="inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <DocumentDetails
        key={selectedDocumentId ?? "no-document"}
        document={selectedDocument}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteMode(null);
          setDocumentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={
          deleteMode === "multiple"
            ? `Delete ${selectedIds.size} documents?`
            : "Delete document?"
        }
        description={
          deleteMode === "multiple"
            ? `Are you sure you want to delete ${selectedIds.size} selected documents? This action cannot be undone.`
            : `Are you sure you want to delete "${documentToDelete?.fileName}"? This action cannot be undone.`
        }
        isLoading={deleteDocument.isLoading}
        itemNameToConfirm={deleteConfirmationText}
      />
    </div>
  );
}
