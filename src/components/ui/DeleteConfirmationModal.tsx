"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  itemNameToConfirm: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemNameToConfirm,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [confirmInput, setConfirmInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmInput("");
    }
  }, [isOpen]);

  const isConfirmDisabled = confirmInput !== itemNameToConfirm || isSubmitting || isLoading;

  const handleConfirm = async () => {
    if (confirmInput !== itemNameToConfirm) return;

    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        {/* Warning Icon and Description */}
        <div className="flex gap-4 rounded-2xl bg-red-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-900">{description}</p>
            <p className="mt-1 text-sm text-red-700">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Confirmation Input */}
        <div>
          <label className="block text-sm font-medium text-foreground">
            Type <span className="font-semibold text-red-600">"{itemNameToConfirm}"</span> to confirm
          </label>
          <input
            type="text"
            value={confirmInput}
            onChange={(event) => setConfirmInput(event.target.value)}
            disabled={isLoading || isSubmitting}
            placeholder="Enter the item name"
            className="mt-2 w-full rounded-2xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading || isSubmitting}
            className="rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
