"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GitBranch, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useGetBranchBySlug, useInviteBranchManager } from "@/lib/hooks/useBranches";
import { InviteBranchManagerModal } from "@/components/branches/InviteBranchManagerModal";
import { DepartmentLinkList } from "@/components/org/DepartmentLinkList";
import { MembersTable } from "@/components/org/MembersTable";
import { OrgDetailHeader, OrgDetailSection } from "@/components/org/OrgDetailHeader";
import { OrgPagination } from "@/components/org/OrgPagination";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Role } from "@/types/enum";
import type { Member } from "@/types/member";

const MEMBERS_PAGE_SIZE = 10;

export default function BranchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const branchSlug = typeof params.slug === "string" ? params.slug : "";
  const { user, isLoading, isOwner } = useAuth();
  const { branch, isLoading: isBranchLoading } = useGetBranchBySlug(branchSlug);
  const { mutate: inviteManager, isLoading: isInviting } = useInviteBranchManager();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberPage, setMemberPage] = useState(1);

  useEffect(() => {
    if (!isLoading && user && !isOwner) {
      router.replace("/dashboard");
    }
  }, [isLoading, isOwner, router, user]);

  const departments = branch?.departments ?? [];
  const branchUsers = branch?.users ?? [];

  const members: Member[] = useMemo(
    () =>
      branchUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as Member["role"],
        createdAt: "",
      })),
    [branchUsers],
  );

  const memberCount = members.length || branch?.memberCount || 0;
  const departmentCount = departments.length || branch?.departmentCount || 0;
  const totalMemberPages = Math.max(1, Math.ceil(memberCount / MEMBERS_PAGE_SIZE));

  const paginatedMembers = useMemo(() => {
    const start = (memberPage - 1) * MEMBERS_PAGE_SIZE;
    return members.slice(start, start + MEMBERS_PAGE_SIZE);
  }, [members, memberPage]);

  useEffect(() => {
    if (memberPage > totalMemberPages) {
      setMemberPage(totalMemberPages);
    }
  }, [memberPage, totalMemberPages]);

  useEffect(() => {
    setMemberPage(1);
  }, [branchSlug, memberCount]);

  const handleInvite = (data: { email: string }) => {
    inviteManager(
      { slug: branchSlug, data },
      {
        onSuccess: () => toast.success(`Invitation sent to ${data.email}`),
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Unable to send invitation.",
          );
        },
      },
    );
  };

  if (isLoading || !user || !isOwner) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton width={200} height={32} />
        <LoadingSkeleton height={200} rounded="1rem" />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <OrgDetailHeader
        backHref="/dashboard/branches"
        backLabel="Back to Branches"
        icon={GitBranch}
        title={isBranchLoading ? "Loading…" : (branch?.name ?? "Branch")}
        subtitle={
          branch?.manager
            ? `Branch manager: ${branch.manager.name}`
            : "No branch manager assigned"
        }
        action={
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            <UserPlus className="h-4 w-4" />
            Invite Manager
          </button>
        }
        stats={
          branch
            ? [
                { label: "Departments", value: departmentCount },
                { label: "Members", value: memberCount },
                { label: "Manager", value: branch.manager?.name ?? "—" },
              ]
            : undefined
        }
      />

      <OrgDetailSection title="Departments" count={departmentCount}>
        <DepartmentLinkList
          departments={departments}
          isLoading={isBranchLoading}
          emptyMessage="No departments in this branch yet."
        />
      </OrgDetailSection>

      <OrgDetailSection title="Members" count={memberCount}>
        <div className="overflow-hidden rounded-xl border border-default bg-surface">
          <MembersTable
            members={paginatedMembers}
            isLoading={isBranchLoading}
            emptyMessage="No members in this branch yet."
            compact
            embedded
          />
          <div className="px-4 pb-3">
            <OrgPagination
              page={memberPage}
              pageSize={MEMBERS_PAGE_SIZE}
              total={memberCount}
              onPageChange={setMemberPage}
              disabled={isBranchLoading}
            />
          </div>
        </div>
      </OrgDetailSection>

      <InviteBranchManagerModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onConfirm={handleInvite}
        isSubmitting={isInviting}
      />
    </div>
  );
}
