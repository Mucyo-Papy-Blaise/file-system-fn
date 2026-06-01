"use client";

import { useEffect, useMemo } from "react";
import { AppSelect } from "@/components/ui/AppSelect";
import { useGetBranches } from "@/lib/hooks/useBranches";
import { useGetDepartments } from "@/lib/hooks/useDepartments";
import {
  ALL_SCOPE_VALUE,
  branchSelectOptions,
  departmentSelectOptions,
  showOwnerBranchPicker,
  showOwnerDepartmentPicker,
} from "@/lib/shared-scope-utils";
import { Role } from "@/types/enum";
import { SharedLevel } from "@/types/shared-space";

interface SharedScopeFieldsProps {
  userRole?: string;
  level: SharedLevel;
  branchId: string;
  departmentId: string;
  onBranchChange: (branchId: string) => void;
  onDepartmentChange: (departmentId: string) => void;
  disabled?: boolean;
}

export function SharedScopeFields({
  userRole,
  level,
  branchId,
  departmentId,
  onBranchChange,
  onDepartmentChange,
  disabled = false,
}: SharedScopeFieldsProps) {
  const { branches } = useGetBranches();
  const { departments } = useGetDepartments();

  const showBranch = showOwnerBranchPicker(userRole, level);
  const showDepartment = showOwnerDepartmentPicker(userRole, level);

  const departmentsInBranch = useMemo(() => {
    if (!showDepartment) {
      return [];
    }

    const effectiveBranchId =
      branchId && branchId !== ALL_SCOPE_VALUE ? branchId : null;

    if (!effectiveBranchId) {
      return [];
    }

    return departments.filter((dept) => dept.branchId === effectiveBranchId);
  }, [branchId, departments, showDepartment]);

  useEffect(() => {
    if (!showDepartment) {
      return;
    }

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
  }, [
    branchId,
    departmentId,
    departmentsInBranch,
    onDepartmentChange,
    showDepartment,
  ]);

  if (userRole !== Role.OWNER) {
    return null;
  }

  return (
    <>
      {showBranch ? (
        <div>
          <label className="block text-sm font-medium text-foreground">
            Branch <span className="text-red-600">*</span>
          </label>
          <p className="mt-1 text-xs text-secondary">
            {level === SharedLevel.BRANCH
              ? "All branches can access, or pick one branch only."
              : "Choose the branch, then assign a department below."}
          </p>
          <AppSelect
            className="mt-2"
            value={branchId || ALL_SCOPE_VALUE}
            onValueChange={onBranchChange}
            placeholder="Select branch"
            disabled={disabled}
            options={branchSelectOptions(
              branches,
              level === SharedLevel.BRANCH,
            )}
          />
        </div>
      ) : null}

      {showDepartment ? (
        <div>
          <label className="block text-sm font-medium text-foreground">
            Department
          </label>
          <p className="mt-1 text-xs text-secondary">
            All departments in the selected branch, or one department only.
          </p>
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
      ) : null}
    </>
  );
}
