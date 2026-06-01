'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface EditBranchModalProps {
  isOpen: boolean;
  branchName: string;
  onClose: () => void;
  onConfirm: (name: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function EditBranchModal({
  isOpen,
  branchName,
  onClose,
  onConfirm,
  isSubmitting = false,
}: EditBranchModalProps) {
  const [name, setName] = useState(branchName);

  useEffect(() => {
    if (isOpen) {
      setName(branchName);
    }
  }, [branchName, isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onConfirm(trimmed);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Branch">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">Branch name</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="Enter branch name"
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
