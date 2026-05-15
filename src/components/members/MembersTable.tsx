"use client";

import { useState } from "react";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useCancelInvitation } from "@/lib/hooks/useInvitations";
import type { Invitation } from "@/types/invitation";
import type { Member } from "@/types/member";
import { Role } from "@/types/enum";

interface MembersTableProps {
  members: Member[];
  invitations: Invitation[];
  currentUserRole: Role;
  isLoading: boolean;
  isInvitationsLoading?: boolean;
  onChangeRole: (memberId: string) => void;
  onRemove: (memberId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export function MembersTable({
  members,
  invitations,
  currentUserRole,
  isLoading,
  isInvitationsLoading = false,
  onChangeRole,
  onRemove,
}: MembersTableProps) {
  const cancelInvitation = useCancelInvitation();
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; memberId: string; memberName: string }>({
    isOpen: false,
    memberId: "",
    memberName: "",
  });

  const handleDeleteClick = (memberId: string, memberName: string) => {
    setDeleteConfirm({ isOpen: true, memberId, memberName });
  };

  const handleConfirmDelete = () => {
    onRemove(deleteConfirm.memberId);
    setDeleteConfirm({ isOpen: false, memberId: "", memberName: "" });
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitation.mutateAsync(invitationId);
      toast.success("Invitation cancelled successfully");
    } catch {
      toast.error("Unable to cancel invitation.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-3xl border border-default bg-surface p-5 shadow-sm">
            <div className="grid gap-4 text-sm sm:grid-cols-[160px_1fr_120px_120px_180px]">
              <LoadingSkeleton height={24} width={120} rounded="1rem" />
              <LoadingSkeleton height={24} width="100%" rounded="1rem" />
              <LoadingSkeleton height={24} width={100} rounded="1rem" />
              <LoadingSkeleton height={24} width={100} rounded="1rem" />
              <LoadingSkeleton height={24} width={140} rounded="1rem" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-default bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-bg-secondary)] text-secondary">
            <tr>
              <th className="px-5 py-4 font-medium">Avatar</th>
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Role</th>
              <th className="px-5 py-4 font-medium">Date Joined</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr className="border-t border-default">
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-secondary">
                  No members have accepted an invitation yet.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="border-t border-default">
                  <td className="px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-subtle text-sm font-semibold text-primary">
                      {getInitials(member.name)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground">{member.name}</td>
                  <td className="px-5 py-4 text-secondary">{member.email}</td>
                  <td className="px-5 py-4">
                    <Badge label={member.role} variant={member.role === Role.ADMIN ? "admin" : "member"} />
                  </td>
                  <td className="px-5 py-4 text-secondary">{member.createdAt}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {/* <button
                        type="button"
                        onClick={() => onChangeRole(member.id)}
                        className="rounded-2xl bg-[var(--color-bg-secondary)] px-3 py-2 text-xs font-semibold text-secondary transition hover:bg-[var(--color-bg-tertiary)]"
                      >
                        Change Role
                      </button> */}
                      {currentUserRole === Role.ADMIN && (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(member.id, member.name)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <UserX className="h-4 w-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-3xl border border-default bg-surface shadow-sm">
        <div className="border-b border-default px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">Pending Invitations</h2>
          <p className="mt-1 text-sm text-secondary">Track invitations that are waiting for acceptance.</p>
        </div>

        {isInvitationsLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid gap-4 rounded-2xl border border-default p-4 sm:grid-cols-[1.5fr_120px_140px_120px]">
                <LoadingSkeleton height={20} width="100%" rounded="1rem" />
                <LoadingSkeleton height={20} width={100} rounded="1rem" />
                <LoadingSkeleton height={20} width={110} rounded="1rem" />
                <LoadingSkeleton height={20} width={90} rounded="1rem" />
              </div>
            ))}
          </div>
        ) : invitations.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg-secondary)] text-secondary">
              <tr>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Date Sent</th>
                <th className="px-5 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="border-t border-default">
                  <td className="px-5 py-4 text-foreground">{invitation.email}</td>
                  <td className="px-5 py-4">
                    <Badge
                      label={invitation.role}
                      variant={invitation.role === Role.ADMIN ? "admin" : "member"}
                    />
                  </td>
                  <td className="px-5 py-4 text-secondary">
                    {new Date(invitation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => void handleCancelInvitation(invitation.id)}
                      disabled={cancelInvitation.isLoading}
                      className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancelInvitation.isLoading ? "Cancelling..." : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-5 py-8 text-sm text-secondary">No pending invitations.</div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, memberId: "", memberName: "" })}
        onConfirm={handleConfirmDelete}
        title="Remove Member"
        description={`Are you sure you want to remove "${deleteConfirm.memberName}" from the workspace? They will lose access to all folders and documents.`}
        itemNameToConfirm={deleteConfirm.memberName}
      />
    </>
  );
}
