"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useUpdateSharedSpace } from "@/lib/hooks/useSharedSpaces";
import { toast } from "sonner";
import type { SharedSpace } from "@/types/shared-space";

interface EditSharedSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedSpace: SharedSpace | null;
}

export function EditSharedSpaceModal({
  isOpen,
  onClose,
  sharedSpace,
}: EditSharedSpaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const updateSharedSpace = useUpdateSharedSpace();

  useEffect(() => {
    if (isOpen && sharedSpace) {
      setName(sharedSpace.name);
      setDescription(sharedSpace.description ?? "");
    }
  }, [isOpen, sharedSpace]);

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const handleConfirm = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!sharedSpace) return;

    try {
      await updateSharedSpace.mutateAsync(
        {
          id: sharedSpace.id,
          data: {
            name: trimmedName,
            description: description.trim() || undefined,
          },
        },
      );
      toast.success("Shared space updated successfully");
      handleClose();
    } catch {
      toast.error("Failed to update shared space");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Shared Space">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            disabled={updateSharedSpace.isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">
            Description <span className="text-xs text-secondary">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            disabled={updateSharedSpace.isLoading}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={updateSharedSpace.isLoading}
            className="rounded border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!name.trim() || updateSharedSpace.isLoading}
            className="rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
          >
            {updateSharedSpace.isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
