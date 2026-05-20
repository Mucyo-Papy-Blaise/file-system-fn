"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { InviteMemberModal } from "@/components/members/InviteMemberModal";
import { MembersTable } from "@/components/members/MembersTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/lib/auth-context";
import { useGetInvitations } from "@/lib/hooks/useInvitations";
import type { Member } from "@/types/member";
import { InvitationStatus, Role } from "@/types/enum";
import { toast } from "sonner";

export default function DashboardMembersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [removedMemberIds, setRemovedMemberIds] = useState<string[]>([]);
  const [roleOverrides, setRoleOverrides] = useState<Record<string, Role>>({});
  const { invitations: pendingInvitations, isLoading: isPendingInvitationsLoading } = useGetInvitations(
    InvitationStatus.PENDING,
  );
  const { invitations: acceptedInvitations, isLoading: isAcceptedInvitationsLoading } = useGetInvitations(
    InvitationStatus.ACCEPTED,
  );

  const acceptedMembers = useMemo<Member[]>(
    () =>
      acceptedInvitations.map((invitation) => ({
        id: invitation.id,
        name: invitation.email,
        email: invitation.email,
        role: invitation.role,
        createdAt: new Date(invitation.createdAt).toLocaleDateString(),
      })),
    [acceptedInvitations],
  );

  const members = useMemo(
    () =>
      acceptedMembers
        .map((member) => ({
          ...member,
          role: roleOverrides[member.id] ?? member.role,
        }))
        .filter((member) => !removedMemberIds.includes(member.id)),
    [acceptedMembers, removedMemberIds, roleOverrides],
  );

  useEffect(() => {
    if (!isLoading && user?.role === Role.MEMBER) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoadingTable(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const handleChangeRole = (memberId: string) => {
    setRoleOverrides((prev) => ({
      ...prev,
      [memberId]: prev[memberId] === Role.ADMIN ? Role.MEMBER : Role.ADMIN,
    }));
    toast.success("Member role updated");
  };

  const handleRemoveMember = (memberId: string) => {
    setRemovedMemberIds((prev) => [...prev, memberId]);
    toast.success("Member removed successfully");
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <LoadingSkeleton width={240} height={32} />
            <LoadingSkeleton width="60%" height={16} />
          </div>
          <LoadingSkeleton width={140} height={44} rounded="1.5rem" />
        </div>
        <div className="rounded-3xl border border-default bg-surface p-6">
          <div className="space-y-4">
            {[...Array(4)].map((index) => (
              <div key={index} className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                <LoadingSkeleton width="100%" height={20} />
                <LoadingSkeleton width="100%" height={20} />
                <LoadingSkeleton width="100%" height={20} />
                <LoadingSkeleton width="100%" height={20} />
                <LoadingSkeleton width={32} height={32} rounded="9999px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Members</h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary">
            Invite and manage team members who can access your workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center justify-center rounded bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Invite Member
        </button>
      </div>

      {members.length > 0 || pendingInvitations.length > 0 || isLoadingTable || isPendingInvitationsLoading || isAcceptedInvitationsLoading ? (
        <MembersTable
          members={members}
          invitations={pendingInvitations}
          currentUserRole={user.role as Role}
          isLoading={isLoadingTable || isAcceptedInvitationsLoading}
          isInvitationsLoading={isPendingInvitationsLoading}
          onChangeRole={handleChangeRole}
          onRemove={handleRemoveMember}
        />
      ) : (
        <EmptyState
          title="No members yet"
          description="Invite teammates so they can collaborate on folders and documents."
          actionLabel="Invite Member"
          onAction={() => setIsInviteOpen(true)}
        />
      )}

      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
}
