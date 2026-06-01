"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useGetDocuments } from "@/lib/hooks/useDocuments";
import { useAddDocument } from "@/lib/hooks/useCollections";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { toast } from "sonner";
import type { Collection } from "@/types/collection";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
}

export function AddDocumentModal({
  isOpen,
  onClose,
  collection,
}: AddDocumentModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const { documents, isLoading } = useGetDocuments();
  const addDocument = useAddDocument();

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const query = searchQuery.toLowerCase();
      const isAlreadyInCollection = collection?.documents.some((d) => d.id === doc.id);
      return (
        !isAlreadyInCollection &&
        (doc.title?.toLowerCase().includes(query) ||
          doc.fileName?.toLowerCase().includes(query) ||
          doc.summary?.toLowerCase().includes(query))
      );
    });
  }, [documents, searchQuery, collection]);

  const handleClose = () => {
    setSearchQuery("");
    setSelectedDocumentId(null);
    onClose();
  };

  const handleAddDocument = async () => {
    if (!collection || !selectedDocumentId) {
      toast.error("Please select a document");
      return;
    }

    try {
      await addDocument.mutate(
        {
          collectionSlug: collection.slug,
          documentId: selectedDocumentId,
        },
        {
          onSuccess: () => {
            toast.success("Document added to collection");
            handleClose();
          },
          onError: () => {
            toast.error("Failed to add document");
          },
        },
      );
    } catch (error) {
      toast.error("Failed to add document");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Document to Collection">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search documents
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-default bg-[var(--color-bg-secondary)] text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="Search by title, file name..."
              disabled={isLoading || addDocument.isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Available documents
          </label>
          <div className="max-h-64 overflow-y-auto space-y-2 rounded-2xl border border-default bg-[var(--color-bg-secondary)] p-3">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <LoadingSkeleton key={i} height={60} rounded="0.5rem" />
                ))}
              </div>
            ) : filteredDocuments.length === 0 ? (
              <p className="text-xs text-secondary text-center py-4">
                {documents.length === 0
                  ? "No documents available"
                  : "No documents match your search"}
              </p>
            ) : (
              filteredDocuments.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocumentId(doc.id)}
                  className={[
                    "w-full text-left rounded-lg p-3 transition border",
                    selectedDocumentId === doc.id
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:bg-[var(--color-bg-tertiary)]",
                  ].join(" ")}
                  disabled={addDocument.isLoading}
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.title}
                  </p>
                  <p className="text-xs text-secondary mt-1 line-clamp-1">
                    {doc.summary}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-opacity-10 px-2 py-1 text-xs text-primary">
                      {doc.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-xs text-secondary">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={addDocument.isLoading}
            className="rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleAddDocument()}
            disabled={!selectedDocumentId || addDocument.isLoading}
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addDocument.isLoading ? "Adding..." : "Add Document"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
