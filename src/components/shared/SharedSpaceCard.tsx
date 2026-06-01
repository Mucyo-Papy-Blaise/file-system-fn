"use client";

import Link from "next/link";
import { FolderOpen, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SharedLevelBadge } from "@/components/shared/SharedLevelBadge";
import { Role } from "@/types/enum";
import type { AuthUser } from "@/types/auth";
import type { SharedSpace } from "@/types/shared-space";

interface SharedSpaceCardProps {
  sharedSpace: SharedSpace;
  currentUser: AuthUser | null;
  onEdit?: (sharedSpace: SharedSpace) => void;
  onDelete?: (sharedSpace: SharedSpace) => void;
}

export function SharedSpaceCard({
  sharedSpace,
  currentUser,
  onEdit,
  onDelete,
}: SharedSpaceCardProps) {
  const isCreator = currentUser?.id === sharedSpace.createdBy.id;
  const canManageRole =
    currentUser?.role === Role.OWNER ||
    currentUser?.role === Role.BRANCH_MANAGER ||
    currentUser?.role === Role.DEPT_MANAGER;
  const canModify = Boolean(isCreator && canManageRole);

  const createdDate = new Date(sharedSpace.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleMenuClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative rounded-2xl border border-default bg-surface p-5 shadow-sm transition hover:border-primary/40">
      <Link
        href={`/dashboard/shared/${sharedSpace.id}`}
        className="block space-y-3"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">
              {sharedSpace.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-secondary">
              {sharedSpace.description ?? "No description"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SharedLevelBadge level={sharedSpace.level} />
          <span className="text-xs text-secondary">
            {sharedSpace.documentCount}{" "}
            {sharedSpace.documentCount === 1 ? "document" : "documents"}
          </span>
        </div>
        <p className="text-xs text-secondary">
          {sharedSpace.createdBy.name} · {createdDate}
        </p>
      </Link>

      {canModify ? (
        <div className="absolute right-3 top-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={handleMenuClick}
                aria-label={`Actions for ${sharedSpace.name}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-default bg-surface text-secondary transition hover:bg-[var(--color-bg-secondary)]"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit?.(sharedSpace)}
                className="flex items-center gap-2 text-foreground"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(sharedSpace)}
                className="text-red-600"
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
