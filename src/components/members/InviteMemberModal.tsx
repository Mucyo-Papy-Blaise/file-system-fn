"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useInviteMember } from "@/lib/hooks/useInvitations";
import { useGetDepartments } from "@/lib/hooks/useDepartments";
import { useGetBranches } from "@/lib/hooks/useBranches";
import { useAuth } from "@/lib/auth-context";
import { Modal } from "@/components/ui/Modal";
import { AppSelect } from "@/components/ui/AppSelect";
import { inviteMemberSchema } from "@/types/schema/invitation.schema";
import { branchSelectOptions, departmentSelectOptions } from "@/lib/shared-scope-utils";
import { Role } from "@/types/enum";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const { user, isOwner, isBranchManager, isDeptManager } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(Role.MEMBER);
  const [branchId, setBranchId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const inviteMember = useInviteMember();
  const { departments } = useGetDepartments();
  const { branches } = useGetBranches();
  const userBranchId = user?.branchId;

  const ownerDepartments = useMemo(() => {
    if (!isOwner) {
      return [];
    }

    if (role === Role.BRANCH_MANAGER) {
      return [];
    }

    if (!branchId) {
      return [];
    }

    return departments.filter((dept) => dept.branchId === branchId);
  }, [branchId, departments, isOwner, role]);

  const availableDepartments = isOwner
    ? ownerDepartments
    : isBranchManager && userBranchId
      ? departments.filter((dept) => dept.branchId === userBranchId)
      : [];

  useEffect(() => {
    if (!isOwner) {
      return;
    }

    if (role === Role.BRANCH_MANAGER) {
      if (departmentId) {
        setDepartmentId("");
      }
      return;
    }

    if (
      departmentId &&
      !availableDepartments.some((dept) => dept.id === departmentId)
    ) {
      setDepartmentId("");
    }
  }, [availableDepartments, departmentId, isOwner, role]);

  const handleClose = () => {
    setEmail("");
    setRole(Role.MEMBER);
    setBranchId("");
    setDepartmentId("");
    onClose();
  };

  const handleSubmit = async () => {
    const payload: {
      email: string;
      role?: Role;
      branchId?: string;
      departmentId?: string;
    } = { email: email.trim() };

    if (isOwner) {
      payload.role = role;
      if (role === Role.BRANCH_MANAGER) {
        if (!branchId) {
          toast.error("Please select a branch.");
          return;
        }
        payload.branchId = branchId;
      } else if (role === Role.MEMBER || role === Role.DEPT_MANAGER) {
        if (!branchId) {
          toast.error("Please select a branch.");
          return;
        }
        if (!departmentId) {
          toast.error("Please select a department.");
          return;
        }
        payload.branchId = branchId;
        payload.departmentId = departmentId;
      }
    } else if (isBranchManager) {
      payload.role = Role.MEMBER;
      if (!departmentId) {
        toast.error("Please select a department.");
        return;
      }
      payload.departmentId = departmentId;
    } else if (isDeptManager) {
      payload.role = Role.MEMBER;
    }

    const parsed = inviteMemberSchema.safeParse(payload);

    if (!parsed.success) {
      toast.error("Invalid invitation details.");
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

  const showRoleSelector = isOwner;
  const showDepartmentSelector = isOwner || isBranchManager;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Member">
      <div className="space-y-4">
        {showRoleSelector ? (
          <div>
            <label className="block text-sm font-medium text-foreground">Role</label>
            <AppSelect
              className="mt-2"
              value={role}
              onValueChange={(value) => {
                setRole(value as Role);
                setBranchId("");
                setDepartmentId("");
              }}
              placeholder="Select role"
              options={[
                { value: Role.BRANCH_MANAGER, label: "Branch Manager" },
                { value: Role.DEPT_MANAGER, label: "Department Manager" },
                { value: Role.MEMBER, label: "Member" },
              ]}
            />
          </div>
        ) : null}

        {isOwner && role === Role.BRANCH_MANAGER ? (
          <div>
            <label className="block text-sm font-medium text-foreground">Branch</label>
            <AppSelect
              className="mt-2"
              value={branchId}
              onValueChange={setBranchId}
              placeholder="Select branch"
              options={branchSelectOptions(branches, false)}
            />
          </div>
        ) : null}

        {isOwner &&
        (role === Role.MEMBER || role === Role.DEPT_MANAGER) ? (
          <div>
            <label className="block text-sm font-medium text-foreground">Branch</label>
            <AppSelect
              className="mt-2"
              value={branchId}
              onValueChange={(value) => {
                setBranchId(value);
                setDepartmentId("");
              }}
              placeholder="Select branch"
              options={branchSelectOptions(branches, false)}
            />
          </div>
        ) : null}

        {showDepartmentSelector &&
        (role === Role.MEMBER || role === Role.DEPT_MANAGER || isBranchManager) ? (
          <div>
            <label className="block text-sm font-medium text-foreground">Department</label>
            <AppSelect
              className="mt-2"
              value={departmentId}
              onValueChange={setDepartmentId}
              placeholder={
                isOwner && !branchId
                  ? "Select a branch first"
                  : "Select department"
              }
              disabled={isOwner && !branchId}
              options={departmentSelectOptions(availableDepartments, false)}
            />
          </div>
        ) : null}

        {isDeptManager ? (
          <p className="text-sm text-secondary">
            Invitations will be sent to your department as a member.
          </p>
        ) : null}

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
