'use client';

import Link from 'next/link';
import { GitBranch, MoreVertical, Pencil, Trash2, UserPlus } from 'lucide-react';
import type { Branch } from '@/types/branch';
import type { AuthUser } from '@/types/auth';
import { Role } from '@/types/enum';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BranchCardProps {
  branch: Branch;
  currentUser: AuthUser;
  onEdit: () => void;
  onInviteManager: () => void;
  onDelete: () => void;
}

export function BranchCard({
  branch,
  currentUser,
  onEdit,
  onInviteManager,
  onDelete,
}: BranchCardProps) {
  const isOwner = currentUser.role === Role.OWNER;
  const createdAt = new Date(branch.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative rounded-3xl border border-default bg-surface p-5 shadow-sm transition hover:shadow-md">
      <Link href={`/dashboard/branches/${branch.slug}`} className="block">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
            <GitBranch className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">{branch.name}</h3>
            <p className="mt-1 text-xs text-secondary">Created {createdAt}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-semibold text-secondary">
            {branch.departmentCount} departments
          </span>
          <span className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-semibold text-secondary">
            {branch.memberCount} members
          </span>
        </div>

        <p className="mt-3 text-sm text-secondary">
          Manager: {branch.manager?.name ?? 'Not assigned'}
        </p>
      </Link>

      {isOwner ? (
        <div className="absolute right-4 top-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full p-1.5 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
              ariaLabel={`Actions for ${branch.name}`}
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem
                onClick={onEdit}
                className="flex items-center gap-2 text-foreground"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onInviteManager}
                className="flex items-center gap-2 text-foreground"
              >
                <UserPlus className="h-4 w-4" />
                Invite Branch Manager
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="flex items-center gap-2 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  );
}
