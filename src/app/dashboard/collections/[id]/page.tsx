"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  useGetCollectionById,
  useRemoveDocument,
} from "@/lib/hooks/useCollections";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardDocumentRow } from "@/components/documents/DashboardDocumentRow";
import { AddDocumentModal } from "@/components/collections/AddDocumentModal";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { SortBar } from "@/components/ui/SortBar";
import { toast } from "sonner";
import { Role } from "@/types/enum";
import type { SortOption } from "@/types/document";

export default function CollectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  const { user, isLoading: isAuthLoading } = useAuth();
  const { collection, isLoading } = useGetCollectionById(collectionId);
  const removeDocument = useRemoveDocument();

  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [removingDocumentId, setRemovingDocumentId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const documents = collection?.documents ?? [];
  const sortedDocuments = useMemo(() => {
    const items = [...documents];

    if (sortBy === "name_asc" || sortBy === "name_desc") {
      items.sort((left, right) => left.fileName.localeCompare(right.fileName));
      if (sortBy === "name_desc") {
        items.reverse();
      }
      return items;
    }

    items.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    );

    if (sortBy === "date_desc") {
      items.reverse();
    }

    return items;
  }, [documents, sortBy]);

  if (isAuthLoading || !user) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton width={200} height={32} />
        <LoadingSkeleton width="60%" height={16} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton width={200} height={32} />
        <LoadingSkeleton width="60%" height={16} />
        <div className="grid gap-4 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-3xl border border-default bg-surface p-6"
            >
              <LoadingSkeleton width="60%" height={20} />
              <LoadingSkeleton width="100%" height={14} />
              <LoadingSkeleton width="100%" height={14} />
              <LoadingSkeleton width="65%" height={14} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/collections">
          <button className="flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </button>
        </Link>
        <EmptyState
          title="Collection not found"
          description="The collection you're looking for doesn't exist or has been deleted."
          actionLabel="Go to Collections"
          onAction={() => router.push("/dashboard/collections")}
        />
      </div>
    );
  }

  const isCreator = user.id === collection.createdBy.id;
  const isAdmin = user.role === Role.ADMIN;
  const canModify = isCreator || isAdmin;

  const removingDocument = sortedDocuments.find((d) => d.id === removingDocumentId);

  const handleRemoveConfirm = async () => {
    if (!removingDocumentId) return;

    try {
      await removeDocument.mutate(
        {
          collectionId: collection.id,
          documentId: removingDocumentId,
        },
        {
          onSuccess: () => {
            toast.success("Document removed from collection");
            setRemovingDocumentId(null);
          },
          onError: () => {
            toast.error("Failed to remove document");
          },
        },
      );
    } catch (error) {
      toast.error("Failed to remove document");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/collections">
            <button className="mb-3 flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Collections
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{collection.name}</h1>
          {collection.description && (
            <p className="mt-2 text-sm text-secondary">{collection.description}</p>
          )}
          <p className="mt-1 text-xs text-secondary">
            Created by {collection.createdBy.name} on{" "}
            {new Date(collection.createdAt).toLocaleDateString()}
          </p>
        </div>
        {canModify && (
          <button
            onClick={() => setIsAddDocumentModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Add Document
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="No documents in this collection"
          description="No documents in this collection yet."
          actionLabel={canModify ? "Add Document" : "Go Back"}
          onAction={() =>
            canModify
              ? setIsAddDocumentModalOpen(true)
              : router.push("/dashboard/collections")
          }
        />
      ) : (
        <div className="space-y-4">
          <SortBar sortBy={sortBy} onChange={setSortBy} />

          <div className="overflow-x-auto rounded-3xl border border-default bg-surface">
            <div className="grid gap-4 border-b border-default px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-secondary md:grid-cols-[2.5fr_1fr_1fr_1fr_auto]">
              <span>Name</span>
              <span>Owner</span>
              <span>Last changes</span>
              <span>Category</span>
              <span className="text-right">Actions</span>
            </div>
            {sortedDocuments.map((document) => (
              <div key={document.id}>
                <DashboardDocumentRow
                  document={document}
                  onDetails={(doc) => router.push(`/documents/${doc.id}`)}
                  onOpen={(doc) => {
                    if (!doc.fileUrl) return;
                    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
                  }}
                  onDownload={(doc) => {
                    if (!doc.fileUrl) return;
                    const link = window.document.createElement("a");
                    link.href = doc.fileUrl;
                    link.download = doc.fileName;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.click();
                  }}
                  extraAction={
                    canModify ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-default bg-surface text-secondary transition hover:bg-[var(--color-bg-secondary)]"
                          aria-label={`Actions for ${document.title || document.fileName}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
                          <DropdownMenuItem
                            onClick={() => setRemovingDocumentId(document.id)}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <Trash className="h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <AddDocumentModal
        isOpen={isAddDocumentModalOpen}
        onClose={() => setIsAddDocumentModalOpen(false)}
        collection={collection}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(removingDocumentId) && Boolean(removingDocument)}
        onClose={() => setRemovingDocumentId(null)}
        onConfirm={handleRemoveConfirm}
        title="Remove Document"
        description={`Remove "${removingDocument?.title}" from this collection?`}
        itemNameToConfirm={removingDocument?.title ?? ""}
        isLoading={removeDocument.isLoading}
      />
    </div>
  );
}
