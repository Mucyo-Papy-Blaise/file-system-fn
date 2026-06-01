"use client";

import { Library, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/types/enum";
import type { AuthUser } from "@/types/auth";
import type { Collection } from "@/types/collection";

interface CollectionCardProps {
  collection: Collection;
  currentUser: AuthUser | null;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
}

export function CollectionCard({
  collection,
  currentUser,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const isCreator = currentUser?.id === collection.createdBy.id;
  const canManageScope =
    currentUser?.role === Role.OWNER ||
    currentUser?.role === Role.BRANCH_MANAGER ||
    currentUser?.role === Role.DEPT_MANAGER;
  const canModify = isCreator || canManageScope;

  const handleMenuClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEditClick = () => {
    onEdit?.(collection);
  };

  const handleDeleteClick = () => {
    onDelete?.(collection);
  };

  const createdDate = new Date(collection.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid items-center gap-4 border-b border-default px-4 py-4 text-sm text-foreground md:grid-cols-[2.5fr_1fr_1fr_1fr_auto]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-bg-secondary)] text-primary">
          <Library className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <Link
            href={`/dashboard/collections/${collection.slug}`}
            className="block truncate text-sm font-semibold text-foreground transition hover:text-primary"
          >
            {collection.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-secondary">
            {collection.description ?? "No description"}
          </p>
        </div>
      </div>

      <div className="truncate text-secondary">{collection.createdBy.name}</div>

      <div className="truncate text-secondary">{createdDate}</div>

      <div className="truncate">
        <span className="inline-flex rounded-full bg-opacity-10 px-2 py-1 text-xs font-semibold text-primary">
          {collection.documentCount} {collection.documentCount === 1 ? "document" : "documents"}
        </span>
      </div>

      <div className="flex justify-end">
        {canModify ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={handleMenuClick}
                aria-label={`Collection actions for ${collection.name}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-default bg-surface text-secondary transition hover:bg-[var(--color-bg-secondary)]"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleEditClick}
                className="flex items-center gap-2 text-foreground"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
}
