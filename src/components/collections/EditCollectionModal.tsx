"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { useUpdateCollection } from "@/lib/hooks/useCollections";
import { toast } from "sonner";
import type { Collection } from "@/types/collection";

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
}

export function EditCollectionModal({
  isOpen,
  onClose,
  collection,
}: EditCollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const updateCollection = useUpdateCollection();

  useEffect(() => {
    if (isOpen && collection) {
      setName(collection.name);
      setDescription(collection.description ?? "");
    }
  }, [isOpen, collection]);

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const handleConfirm = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Collection name cannot be empty");
      return;
    }

    if (!collection) return;

    try {
      await updateCollection.mutate(
        {
          slug: collection.slug,
          data: {
            name: trimmedName,
            description: description.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success("Collection updated successfully");
            handleClose();
          },
          onError: () => {
            toast.error("Failed to update collection");
          },
        },
      );
    } catch (error) {
      toast.error("Failed to update collection");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Collection">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Collection name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Enter collection name"
            disabled={updateCollection.isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Description <span className="text-xs text-secondary">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Enter collection description"
            rows={3}
            disabled={updateCollection.isLoading}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={updateCollection.isLoading}
            className="rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!name.trim() || updateCollection.isLoading}
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateCollection.isLoading ? "Updating..." : "Update Collection"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
