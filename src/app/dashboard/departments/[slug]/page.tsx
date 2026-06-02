"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  useGetDepartmentBySlug,
  useInviteDeptManager,
} from "@/lib/hooks/useDepartments";
import { InviteAdminModal } from "@/components/departments/InviteAdminModal";
import { MembersTable } from "@/components/org/MembersTable";
import { OrgDetailHeader, OrgDetailSection } from "@/components/org/OrgDetailHeader";
import { OrgPagination } from "@/components/org/OrgPagination";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Role } from "@/types/enum";

const MEMBERS_PAGE_SIZE = 10;

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const departmentSlug = typeof params.slug === "string" ? params.slug : "";
  const { user, isLoading, isOwner, isBranchManager, isDeptManager } = useAuth();
  const { department, isLoading: isDepartmentLoading } =
    useGetDepartmentBySlug(departmentSlug);
  const { mutate: inviteDeptManager, isLoading: isInviting } = useInviteDeptManager();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberPage, setMemberPage] = useState(1);

  const canAccess = isOwner || isBranchManager || isDeptManager;
  const canInvite = isOwner || isBranchManager;

  useEffect(() => {
    if (!isLoading && user && !canAccess) {
      router.replace("/dashboard");
    }
  }, [canAccess, isLoading, router, user]);

  const members = department?.members ?? [];
  const manager = members.find((m) => m.role === Role.DEPT_MANAGER);
  const memberCount = members.length || department?.memberCount || 0;
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
  }, [departmentSlug, memberCount]);

  const handleInvite = (data: { email: string }) => {
    inviteDeptManager(
      { slug: departmentSlug, data },
      {
        onSuccess: () => toast.success("Department manager invitation sent"),
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to send invitation.",
          );
        },
      },
    );
  };

  if (isLoading || !user || !canAccess) {
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
        backHref="/dashboard/departments"
        backLabel="Back to Departments"
        icon={Building}
        title={isDepartmentLoading ? "Loading…" : (department?.name ?? "Department")}
        subtitle={
          department?.branch
            ? `Branch: ${department.branch.name}`
            : manager
              ? `Manager: ${manager.name}`
              : "No department manager assigned"
        }
        action={
          canInvite ? (
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              <UserPlus className="h-4 w-4" />
              Invite Manager
            </button>
          ) : undefined
        }
        stats={
          department
            ? [
                { label: "Members", value: memberCount },
                { label: "Folders", value: department.folderCount },
                { label: "Manager", value: manager?.name ?? "—" },
              ]
            : undefined
        }
      />

      <OrgDetailSection title="Team members" count={memberCount}>
        <div className="overflow-hidden rounded-xl border border-default bg-surface">
          <MembersTable
            members={paginatedMembers}
            isLoading={isDepartmentLoading}
            emptyMessage="No members in this department yet. Invite a department manager to get started."
            compact
            embedded
          />
          <div className="px-4 pb-3">
            <OrgPagination
              page={memberPage}
              pageSize={MEMBERS_PAGE_SIZE}
              total={memberCount}
              onPageChange={setMemberPage}
              disabled={isDepartmentLoading}
            />
          </div>
        </div>
      </OrgDetailSection>

      <InviteAdminModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onConfirm={handleInvite}
        isSubmitting={isInviting}
      />
    </div>
  );
}
