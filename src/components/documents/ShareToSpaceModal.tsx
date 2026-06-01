"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SharedLevelBadge } from "@/components/shared/SharedLevelBadge";
import { useGetSharedSpaces, useShareDocument } from "@/lib/hooks/useSharedSpaces";
import { toast } from "sonner";

interface ShareToSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
}

export function ShareToSpaceModal({
  isOpen,
  onClose,
  documentId,
}: ShareToSpaceModalProps) {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const { sharedSpaces, isLoading } = useGetSharedSpaces();
  const shareDocument = useShareDocument();

  const handleClose = () => {
    setSelectedSpaceId(null);
    onClose();
  };

  const handleShare = async () => {
    if (!selectedSpaceId) {
      toast.error("Select a shared space");
      return;
    }

    try {
      await shareDocument.mutateAsync({
        spaceId: selectedSpaceId,
        documentId,
      });
      toast.success("Shared successfully");
      handleClose();
    } catch {
      toast.error("Failed to share document");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share to Shared Space">
      <div className="space-y-4">
        <div className="max-h-72 space-y-2 overflow-y-auto">
          {isLoading ? (
            <p className="text-sm text-secondary">Loading shared spaces...</p>
          ) : sharedSpaces.length === 0 ? (
            <p className="text-sm text-secondary">
              No shared spaces available. Create one from Shared Spaces first.
            </p>
          ) : (
            sharedSpaces.map((space) => {
              const isSelected = selectedSpaceId === space.id;
              return (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => setSelectedSpaceId(space.id)}
                  className={[
                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-default bg-[var(--color-bg-secondary)] hover:border-primary/40",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {space.name}
                      </p>
                      <p className="mt-1 text-xs text-secondary">
                        {space.documentCount}{" "}
                        {space.documentCount === 1 ? "document" : "documents"}
                      </p>
                    </div>
                    <SharedLevelBadge level={space.level} />
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
            disabled={!selectedSpaceId || shareDocument.isLoading}
            className="rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
          >
            {shareDocument.isLoading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
