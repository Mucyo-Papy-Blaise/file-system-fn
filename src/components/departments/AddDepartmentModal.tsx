"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (departmentName: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function AddDepartmentModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: AddDepartmentModalProps) {
  const [departmentName, setDepartmentName] = useState("");

  const handleClose = () => {
    setDepartmentName("");
    onClose();
  };

  const handleConfirm = async () => {
    const trimmed = departmentName.trim();
    if (!trimmed) return;

    await onConfirm(trimmed);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Department">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          Department name
        </label>
        <input
          type="text"
          value={departmentName}
          onChange={(event) => setDepartmentName(event.target.value)}
          className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="Enter department name"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!departmentName.trim() || isSubmitting}
            className="rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Department"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
