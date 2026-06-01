"use client";

import { useEffect, useMemo } from "react";
import { AppSelect } from "@/components/ui/AppSelect";
import { useGetBranches } from "@/lib/hooks/useBranches";
import { useGetDepartments } from "@/lib/hooks/useDepartments";
import {
  ALL_SCOPE_VALUE,
  branchSelectOptions,
  departmentSelectOptions,
} from "@/lib/shared-scope-utils";

interface FolderScopeFieldsProps {
  branchId: string;
  departmentId: string;
  onBranchChange: (branchId: string) => void;
  onDepartmentChange: (departmentId: string) => void;
  disabled?: boolean;
}

export function FolderScopeFields({
  branchId,
  departmentId,
  onBranchChange,
  onDepartmentChange,
  disabled = false,
}: FolderScopeFieldsProps) {
  const { branches } = useGetBranches();
  const { departments } = useGetDepartments();

  const departmentsInBranch = useMemo(() => {
    const effectiveBranchId =
      branchId && branchId !== ALL_SCOPE_VALUE ? branchId : null;

    if (!effectiveBranchId) {
      return [];
    }

    return departments.filter((dept) => dept.branchId === effectiveBranchId);
  }, [branchId, departments]);

  useEffect(() => {
    if (!branchId || branchId === ALL_SCOPE_VALUE) {
      if (departmentId) {
        onDepartmentChange("");
      }
      return;
    }

    if (
      departmentId &&
      departmentId !== ALL_SCOPE_VALUE &&
      !departmentsInBranch.some((dept) => dept.id === departmentId)
    ) {
      onDepartmentChange("");
    }
  }, [branchId, departmentId, departmentsInBranch, onDepartmentChange]);

  return (
    <div className="space-y-4 rounded-2xl border border-default bg-[var(--color-bg-secondary)]/50 p-4">
      <p className="text-xs text-secondary">
        Assign who can see this folder. All branches, one branch, or a specific
        department in a branch.
      </p>
      <div>
        <label className="block text-sm font-medium text-foreground">Branch</label>
        <AppSelect
          className="mt-2"
          value={branchId || ALL_SCOPE_VALUE}
          onValueChange={onBranchChange}
          placeholder="Select branch"
          disabled={disabled}
          options={branchSelectOptions(branches, true)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">
          Department
        </label>
        <AppSelect
          className="mt-2"
          value={departmentId || ALL_SCOPE_VALUE}
          onValueChange={onDepartmentChange}
          placeholder={
            branchId && branchId !== ALL_SCOPE_VALUE
              ? "Select department"
              : "Select a branch first"
          }
          disabled={
            disabled || !branchId || branchId === ALL_SCOPE_VALUE
          }
          options={departmentSelectOptions(departmentsInBranch, true)}
        />
      </div>
    </div>
  );
}
