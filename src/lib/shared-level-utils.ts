import { SharedLevel } from "@/types/shared-space";

export const sharedLevelLabels: Record<SharedLevel, string> = {
  [SharedLevel.ORGANIZATION]: "Organization",
  [SharedLevel.BRANCH]: "Branch",
  [SharedLevel.DEPARTMENT]: "Department",
};

export const sharedLevelBadgeClass: Record<SharedLevel, string> = {
  [SharedLevel.ORGANIZATION]: "bg-primary/10 text-primary",
  [SharedLevel.BRANCH]: "bg-blue-100 text-blue-700",
  [SharedLevel.DEPARTMENT]: "bg-purple-100 text-purple-700",
};

export function getCreatableSharedLevels(role: string): SharedLevel[] {
  const levels: SharedLevel[] = [];

  if (role === "OWNER") {
    levels.push(
      SharedLevel.ORGANIZATION,
      SharedLevel.BRANCH,
      SharedLevel.DEPARTMENT,
    );
  } else if (role === "BRANCH_MANAGER") {
    levels.push(SharedLevel.BRANCH, SharedLevel.DEPARTMENT);
  } else if (role === "DEPT_MANAGER") {
    levels.push(SharedLevel.DEPARTMENT);
  }

  return levels;
}
