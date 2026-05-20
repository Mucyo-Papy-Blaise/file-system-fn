"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useCreateCollection } from "@/lib/hooks/useCollections";
import { toast } from "sonner";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCollectionModal({
  isOpen,
  onClose,
}: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createCollection = useCreateCollection();

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

    try {
      await createCollection.mutate(
        {
          name: trimmedName,
          description: description.trim() || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Collection created successfully");
            handleClose();
          },
          onError: () => {
            toast.error("Failed to create collection");
          },
        },
      );
    } catch (error) {
      toast.error("Failed to create collection");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Collection">
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
            disabled={createCollection.isLoading}
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
            disabled={createCollection.isLoading}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={createCollection.isLoading}
            className="rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!name.trim() || createCollection.isLoading}
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createCollection.isLoading ? "Creating..." : "Create Collection"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
