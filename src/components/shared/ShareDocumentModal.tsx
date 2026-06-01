"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useGetDocuments } from "@/lib/hooks/useDocuments";
import { useShareDocument } from "@/lib/hooks/useSharedSpaces";
import { toast } from "sonner";

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedSpaceId: string;
}

export function ShareDocumentModal({
  isOpen,
  onClose,
  sharedSpaceId,
}: ShareDocumentModalProps) {
  const [search, setSearch] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );
  const { documents, isLoading } = useGetDocuments({ limit: 100, page: 1 });
  const shareDocument = useShareDocument();

  const filteredDocuments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return documents;

    return documents.filter((doc) => {
      const title = (doc.title ?? doc.fileName).toLowerCase();
      return (
        title.includes(term) ||
        doc.fileName.toLowerCase().includes(term) ||
        doc.category?.name?.toLowerCase().includes(term)
      );
    });
  }, [documents, search]);

  const handleClose = () => {
    setSearch("");
    setSelectedDocumentId(null);
    onClose();
  };

  const handleShare = async () => {
    if (!selectedDocumentId) {
      toast.error("Select a document to share");
      return;
    }

    try {
      await shareDocument.mutateAsync({
        spaceId: sharedSpaceId,
        documentId: selectedDocumentId,
      });
      toast.success("Document shared successfully");
      handleClose();
    } catch {
      toast.error("Failed to share document");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Share Document to Space"
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your documents..."
            className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto">
          {isLoading ? (
            <p className="text-sm text-secondary">Loading documents...</p>
          ) : filteredDocuments.length === 0 ? (
            <p className="text-sm text-secondary">No documents found.</p>
          ) : (
            filteredDocuments.map((doc) => {
              const isSelected = selectedDocumentId === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocumentId(doc.id)}
                  className={[
                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-default bg-[var(--color-bg-secondary)] hover:border-primary/40",
                  ].join(" ")}
                >
                  <p className="truncate text-sm font-semibold text-foreground">
                    {doc.title || doc.fileName}
                  </p>
                  <p className="mt-1 truncate text-xs text-secondary">
                    {doc.fileName}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-secondary">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                      {doc.category?.name ?? "Uncategorized"}
                    </span>
                    <span>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={shareDocument.isLoading}
            className="rounded border border-default px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!selectedDocumentId || shareDocument.isLoading}
            className="rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
          >
            {shareDocument.isLoading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
