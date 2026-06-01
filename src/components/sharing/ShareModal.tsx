"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { RoleBadge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { useGetOrgMembers } from "@/lib/hooks/useOrgMembers";
import { useShareDocument } from "@/lib/hooks/useSharing";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  collectionId?: string;
  documentName?: string;
}

const MAX_MESSAGE_LENGTH = 500;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ShareModal({
  isOpen,
  onClose,
  documentId,
  collectionId,
  documentName,
}: ShareModalProps) {
  const { user } = useAuth();
  const { members, isLoading } = useGetOrgMembers();
  const shareDocument = useShareDocument();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const titleName = documentName ?? "item";

  const availableMembers = useMemo(
    () =>
      members.filter((member) => member.id !== user?.id),
    [members, user?.id],
  );

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return availableMembers;

    return availableMembers.filter((member) => {
      const branch = member.branch?.name?.toLowerCase() ?? "";
      const department = member.department?.name?.toLowerCase() ?? "";
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        branch.includes(query) ||
        department.includes(query)
      );
    });
  }, [availableMembers, search]);

  const selectedMembers = useMemo(
    () => availableMembers.filter((member) => selectedIds.includes(member.id)),
    [availableMembers, selectedIds],
  );

  const toggleMember = (memberId: string) => {
    setSelectedIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleClose = () => {
    setSearch("");
    setSelectedIds([]);
    setMessage("");
    onClose();
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;

    try {
      await shareDocument.mutateAsync({
        recipientIds: selectedIds,
        message: message.trim() || undefined,
        documentId,
        collectionId,
      });
      toast.success(`Shared with ${selectedIds.length} members`);
      handleClose();
    } catch {
      toast.error("Failed to share");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Share ${titleName}`}
    >
      <div className="space-y-4 p-1">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search members..."
          className="w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-2.5 text-sm text-foreground placeholder-secondary focus:border-primary focus:outline-none"
        />

        <div className="max-h-64 space-y-2 overflow-y-auto rounded-2xl border border-default p-2">
          {isLoading ? (
            <p className="px-3 py-4 text-sm text-secondary">Loading members...</p>
          ) : filteredMembers.length === 0 ? (
            <p className="px-3 py-4 text-sm text-secondary">No members found</p>
          ) : (
            filteredMembers.map((member) => {
              const isSelected = selectedIds.includes(member.id);
              const scopeLabel =
                member.department?.name ?? member.branch?.name ?? "Organization";

              return (
                <label
                  key={member.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[var(--color-bg-secondary)]"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleMember(member.id)}
                    className="h-4 w-4 rounded border-default text-primary focus:ring-primary"
                  />
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-semibold text-primary">
                    {getInitials(member.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {member.name}
                      </span>
                      <RoleBadge role={member.role} />
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-secondary">
                      {scopeLabel}
                    </span>
                  </span>
                </label>
              );
            })
          )}
        </div>

        {selectedMembers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((member) => (
              <span
                key={member.id}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-medium text-foreground"
              >
                {member.name}
                <button
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  className="text-secondary hover:text-foreground"
                  aria-label={`Remove ${member.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <p className="text-xs font-medium text-secondary">
          {selectedIds.length} members selected
        </p>

        <div>
          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value.slice(0, MAX_MESSAGE_LENGTH))
            }
            placeholder="Add a message... (optional)"
            rows={3}
            className="w-full resize-none rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground placeholder-secondary focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-right text-xs text-secondary">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-default px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-bg-secondary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={selectedIds.length === 0 || shareDocument.isLoading}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {shareDocument.isLoading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
