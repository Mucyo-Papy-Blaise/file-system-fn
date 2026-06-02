"use client";

import { RoleBadge } from "@/components/ui/Badge";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Role } from "@/types/enum";
import type { Member } from "@/types/member";

interface MembersTableProps {
  members: Member[];
  isLoading?: boolean;
  emptyMessage?: string;
  compact?: boolean;
  /** When true, omits outer card border (use inside a parent panel with pagination). */
  embedded?: boolean;
}

function normalizeRole(role: string): Role {
  if (Object.values(Role).includes(role as Role)) {
    return role as Role;
  }
  return Role.MEMBER;
}

export function MembersTable({
  members,
  isLoading = false,
  emptyMessage = "No members in this group yet.",
  compact = false,
  embedded = false,
}: MembersTableProps) {
  const cellPad = compact ? "px-4 py-2" : "px-5 py-3";
  const headPad = compact ? "px-4 py-2.5" : "px-5 py-3";
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {[...Array(3)].map((_, index) => (
          <LoadingSkeleton key={index} height={40} rounded="0.5rem" />
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-default bg-[var(--color-bg-secondary)]/40 px-4 py-8 text-center">
        <p className="text-sm text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={
        embedded
          ? "overflow-hidden"
          : "overflow-hidden rounded-xl border border-default bg-surface"
      }
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-default bg-[var(--color-bg-secondary)] text-[11px] font-semibold uppercase tracking-wider text-muted">
            <th className={headPad}>Name</th>
            <th className={headPad}>Email</th>
            <th className={`${headPad} text-right`}>Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr
              key={member.id}
              className="border-t border-default transition-colors hover:bg-[var(--color-bg-secondary)]/50"
            >
              <td className={cellPad}>
                <p className="font-medium text-foreground">{member.name}</p>
              </td>
              <td className={`${cellPad} text-secondary`}>{member.email}</td>
              <td className={`${cellPad} text-right`}>
                <RoleBadge role={normalizeRole(member.role)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
