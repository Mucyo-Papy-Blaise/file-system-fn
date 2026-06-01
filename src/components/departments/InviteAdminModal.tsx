"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { email: string }) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function InviteAdminModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: InviteAdminModalProps) {
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  const handleConfirm = async () => {
    await onConfirm({ email: email.trim() });
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite Department Manager"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="manager@example.com"
          />
        </div>

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
            disabled={!email.trim() || isSubmitting}
            className="rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
