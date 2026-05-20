"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useInviteMember } from "@/lib/hooks/useInvitations";
import { Modal } from "@/components/ui/Modal";
import { inviteMemberSchema } from "@/types/schema/invitation.schema";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const inviteMember = useInviteMember();

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  const handleSubmit = async () => {
    const parsed = inviteMemberSchema.safeParse({ email });

    if (!parsed.success) {
      toast.error(parsed.error.flatten().fieldErrors.email?.[0] ?? "Enter a valid email address.");
      return;
    }

      try {
      await inviteMember.mutateAsync(parsed.data);
      toast.success("Invitation sent successfully");
      handleClose();
    } catch {
      toast.error("Unable to send invitation.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Member">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="member@example.com"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={inviteMember.isLoading}
            className="rounded border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={inviteMember.isLoading}
            className="rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {inviteMember.isLoading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
