import { Role } from '@/types/enum';
import { roleToBadgeVariant } from '@/lib/role-utils';

export type BadgeVariant =
  | 'admin'
  | 'member'
  | 'category'
  | 'owner'
  | 'branch_manager'
  | 'dept_manager';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const badgeStyles: Record<BadgeVariant, string> = {
  admin: 'bg-primary-subtle text-primary',
  member: 'bg-[var(--color-bg-secondary)] text-secondary',
  category: 'bg-[var(--color-bg-tertiary)] text-foreground',
  owner: 'bg-emerald-900/90 text-emerald-50',
  branch_manager: 'bg-blue-100 text-blue-800',
  dept_manager: 'bg-purple-100 text-purple-800',
};

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]',
        badgeStyles[variant],
      ].join(' ')}
    >
      {label}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  return <Badge label={role.replace(/_/g, ' ')} variant={roleToBadgeVariant(role)} />;
}
