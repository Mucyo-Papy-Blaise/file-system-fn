"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (categoryName: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  const handleConfirm = async () => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    await onConfirm(trimmed);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Category">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          Category name
        </label>
        <input
          type="text"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="Enter category name"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!categoryName.trim() || isSubmitting}
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
