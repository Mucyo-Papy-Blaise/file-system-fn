import { Role } from '@/types/enum';
import type { BadgeVariant } from '@/components/ui/Badge';

export function roleToBadgeVariant(role: Role): BadgeVariant {
  switch (role) {
    case Role.OWNER:
      return 'owner';
    case Role.BRANCH_MANAGER:
      return 'branch_manager';
    case Role.DEPT_MANAGER:
      return 'dept_manager';
    case Role.MEMBER:
    default:
      return 'member';
  }
}

export function formatRoleLabel(role: Role): string {
  switch (role) {
    case Role.OWNER:
      return 'Owner';
    case Role.BRANCH_MANAGER:
      return 'Branch Manager';
    case Role.DEPT_MANAGER:
      return 'Dept Manager';
    case Role.MEMBER:
    default:
      return 'Member';
  }
}
