"use client";

import { useMemo, useState } from "react";
import {
  Eye,
  FileText,
  FolderPlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { MoveFolderModal } from "./MoveFolderModal";
import { useDeleteDocument, useRenameDocument } from "@/lib/hooks/useDocuments";
import type { Document } from "@/types/document";

interface InboxDocumentCardProps {
  document: Document;
}

export function InboxDocumentCard({ document }: InboxDocumentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(document.fileName);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const renameDocument = useRenameDocument();
  const deleteDocument = useDeleteDocument();

  const formattedDate = useMemo(
    () => new Date(document.createdAt).toLocaleDateString(),
    [document.createdAt],
  );

  const handleRenameSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === document.fileName) {
      setIsEditing(false);
      return;
    }

    try {
      await renameDocument.mutateAsync({ id: document.id, fileName: trimmedName });
      toast.success("Document renamed successfully");
    } catch (error) {
      console.error("Rename document error:", error);
      toast.error("Failed to rename document");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDocument.mutateAsync(document.id);
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Delete document error:", error);
      toast.error("Failed to delete document");
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const openPreview = () => {
    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-3xl border border-default bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-subtle text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            {isEditing ? (
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={handleRenameSave}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleRenameSave();
                  }
                }}
                className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            ) : (
              <h3 className="truncate text-lg font-semibold text-foreground">
                {document.fileName}
              </h3>
            )}
            <p className="mt-2 text-sm text-secondary">Uploaded by {document.uploadedBy.name}</p>
            <p className="text-sm text-secondary">Added on {formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-secondary">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-2xl border border-default bg-background p-2 transition hover:border-primary hover:text-foreground"
            aria-label="Rename document"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsMoveOpen(true)}
            className="rounded-2xl border border-default bg-background p-2 transition hover:border-primary hover:text-foreground"
            aria-label="Move document"
          >
            <FolderPlus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border border-default bg-[var(--color-bg-secondary)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">Category</p>
          <p className="mt-2 text-sm text-foreground">{document.category?.name ?? document.category}</p>
        </div>
        <div className="rounded-3xl border border-default bg-[var(--color-bg-secondary)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">Folder</p>
          <p className="mt-2 text-sm text-foreground">{document.folder?.name ?? "Inbox"}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={openPreview}
          className="inline-flex items-center gap-2 rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>

      <MoveFolderModal
        isOpen={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
        documentId={document.id}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        description="This will permanently remove the document from your inbox."
        itemNameToConfirm={document.fileName}
        isLoading={deleteDocument.isLoading}
      />
    </div>
  );
}
