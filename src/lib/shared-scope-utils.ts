import { Role } from "@/types/enum";
import { SharedLevel } from "@/types/shared-space";
import type { AuthUser } from "@/types/auth";

export interface ScopedResourceRef {
  level: SharedLevel;
  branchId?: string | null;
  departmentId?: string | null;
}

/** Mirrors backend canManageSharedSpace / canManageCollection for shared resources. */
export function canManageScopedResource(
  user: AuthUser | null | undefined,
  resource: ScopedResourceRef,
): boolean {
  if (!user) return false;
  if (user.role === Role.MEMBER) return false;
  if (user.role === Role.OWNER) return true;

  if (user.role === Role.BRANCH_MANAGER && resource.level === SharedLevel.BRANCH) {
    return !resource.branchId || resource.branchId === user.branchId;
  }

  if (user.role === Role.DEPT_MANAGER && resource.level === SharedLevel.DEPARTMENT) {
    if (resource.branchId && resource.branchId !== user.branchId) {
      return false;
    }
    return !resource.departmentId || resource.departmentId === user.departmentId;
  }

  return false;
}

/** Sentinel for "All" in AppSelect (empty string is reserved). */
export const ALL_SCOPE_VALUE = "__all__";

export function toScopeApiValue(value: string): string | undefined {
  if (!value || value === ALL_SCOPE_VALUE) {
    return undefined;
  }
  return value;
}

export function branchSelectOptions(
  branches: Array<{ id: string; name: string }>,
  includeAll = true,
) {
  const options = includeAll
    ? [{ value: ALL_SCOPE_VALUE, label: "All branches" }]
    : [];

  return [
    ...options,
    ...branches.map((branch) => ({ value: branch.id, label: branch.name })),
  ];
}

export function departmentSelectOptions(
  departments: Array<{ id: string; name: string }>,
  includeAll = true,
) {
  const options = includeAll
    ? [{ value: ALL_SCOPE_VALUE, label: "All departments" }]
    : [];

  return [
    ...options,
    ...departments.map((dept) => ({ value: dept.id, label: dept.name })),
  ];
}

export function showOwnerBranchPicker(
  role: string | undefined,
  level: SharedLevel,
): boolean {
  return (
    role === Role.OWNER &&
    (level === SharedLevel.BRANCH || level === SharedLevel.DEPARTMENT)
  );
}

export function showOwnerDepartmentPicker(
  role: string | undefined,
  level: SharedLevel,
): boolean {
  return role === Role.OWNER && level === SharedLevel.DEPARTMENT;
}
