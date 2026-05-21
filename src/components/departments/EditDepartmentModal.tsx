"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface EditDepartmentModalProps {
  isOpen: boolean;
  departmentName: string;
  onClose: () => void;
  onConfirm: (updatedName: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function EditDepartmentModal({
  isOpen,
  departmentName,
  onClose,
  onConfirm,
  isSubmitting = false,
}: EditDepartmentModalProps) {
  const [name, setName] = useState(departmentName);

  const handleClose = () => {
    setName(departmentName);
    onClose();
  };

  const handleConfirm = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    await onConfirm(trimmed);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Department">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          Department name
        </label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="Update department name"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!name.trim() || isSubmitting}
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
