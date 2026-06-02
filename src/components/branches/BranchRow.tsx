"use client";

import { useRouter } from "next/navigation";
import { GitBranch, MoreVertical, Pencil, Trash2, UserPlus } from "lucide-react";
import type { Branch } from "@/types/branch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BranchRowProps {
  branch: Branch;
  onEdit: () => void;
  onInviteManager: () => void;
  onDelete: () => void;
  isBusy?: boolean;
}

export function BranchRow({
  branch,
  onEdit,
  onInviteManager,
  onDelete,
  isBusy = false,
}: BranchRowProps) {
  const router = useRouter();
  const createdAt = new Date(branch.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const detailHref = `/dashboard/branches/${branch.slug}`;

  const openDetail = () => {
    router.push(detailHref);
  };

  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail();
        }
      }}
      className="group cursor-pointer border-t border-default transition-colors hover:bg-[var(--color-bg-secondary)]/70"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <GitBranch className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground group-hover:text-primary">
              {branch.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted">/{branch.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 tabular-nums text-secondary">
        {branch.departmentCount}
      </td>
      <td className="px-5 py-4 tabular-nums text-secondary">
        {branch.memberCount}
      </td>
      <td className="px-5 py-4">
        <span className="text-sm text-foreground">
          {branch.manager?.name ?? (
            <span className="text-muted">Not assigned</span>
          )}
        </span>
      </td>
      <td className="px-5 py-4 text-secondary">{createdAt}</td>
      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex rounded-lg p-2 text-muted transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
            ariaLabel={`Actions for ${branch.name}`}
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px]">
            <DropdownMenuItem
              onClick={onEdit}
              disabled={isBusy}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onInviteManager}
              disabled={isBusy}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Invite manager
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              disabled={isBusy}
              className="flex items-center gap-2 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
