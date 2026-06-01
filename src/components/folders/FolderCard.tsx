"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  ChevronRight,
  Folder,
  MoreHorizontal,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderCardProps {
  folder: {
    id: string;
    slug: string;
    name: string;
    itemCount?: number;
    updatedAt?: string;
    createdBy?: {
      id: string;
      name: string;
    };
    department?: {
      id: string;
      name: string;
    } | null;
  };
  onOpen: (folderSlug: string) => void;
  onRename?: (folderSlug: string, newName: string) => void;
  onRenameComplete?: (folderSlug: string, finalName: string) => void;
  onDelete?: (folderSlug: string) => void;
  onUpload?: (folderSlug: string) => void;
  isOwner?: boolean;
  readOnly?: boolean;
  startInRenameMode?: boolean;
  showDepartmentColumn?: boolean;
}

function formatFolderItems(itemCount?: number) {
  const count = itemCount ?? 0;

  if (count === 0) {
    return "Empty";
  }

  return count === 1 ? "1 item" : `${count} items`;
}

export function FolderCard({
  folder,
  onOpen,
  onRename,
  onRenameComplete,
  onDelete,
  onUpload,
  isOwner = false,
  readOnly = false,
  startInRenameMode = false,
  showDepartmentColumn = false,
}: FolderCardProps) {
  const [isRenaming, setIsRenaming] = useState(startInRenameMode);
  const [newName, setNewName] = useState(folder.name);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleRenameSubmit = () => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      setNewName(folder.name);
      setIsRenaming(false);
      return;
    }

    if (trimmedName !== folder.name) {
      onRename?.(folder.slug, trimmedName);
    }

    setNewName(trimmedName);
    setIsRenaming(false);
    onRenameComplete?.(folder.slug, trimmedName);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(folder.slug);
    setIsDeleteOpen(false);
  };

  const handleUploadClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onUpload?.(folder.slug);
  };

  const folderGridColumns = showDepartmentColumn
    ? "grid-cols-[minmax(280px,2fr)_140px_140px_160px_minmax(120px,1fr)_120px]"
    : "grid-cols-[minmax(280px,2fr)_140px_140px_minmax(120px,1fr)_120px]";

  return (
    <>
      <div
        onClick={() => !isRenaming && onOpen(folder.slug)}
        className={`group grid cursor-pointer ${folderGridColumns} items-center gap-4 border-t border-default px-4 py-3.5 text-sm transition-colors hover:bg-[var(--color-bg-secondary)]/80`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <Folder className="h-5 w-5 text-amber-600" />
          </div>

          <div className="min-w-0">
            {isRenaming ? (
              <div onClick={(event) => event.stopPropagation()}>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleRenameSubmit();
                    }

                    if (event.key === "Escape") {
                      setIsRenaming(false);
                      setNewName(folder.name);
                    }
                  }}
                  className="w-full border border-[var(--color-border-focus)] bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none"
                />
              </div>
            ) : (
              <>
                <p className="truncate font-medium text-foreground">{folder.name}</p>
                <p className="truncate text-xs text-secondary">
                  {folder.createdBy?.name ? `Created by ${folder.createdBy.name}` : "Folder"}
                </p>
              </>
            )}
          </div>
        </div>

        <p className="truncate text-secondary">
          {folder.updatedAt
            ? new Date(folder.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Just now"}
        </p>
        <p className="truncate text-secondary">Folder</p>
        {showDepartmentColumn ? (
          <p className="truncate text-secondary">
            {folder.department?.name ?? "Unassigned"}
          </p>
        ) : null}
        <p className="truncate text-secondary">{formatFolderItems(folder.itemCount)}</p>

        <div className="relative flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
          {readOnly ? (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary">
              <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </span>
          ) : null}
          {onUpload ? (
            <button
              type="button"
              onClick={handleUploadClick}
              className="inline-flex h-9 items-center gap-2 border border-default bg-surface px-3 text-xs font-medium text-foreground transition hover:bg-[var(--color-bg-secondary)]"
            >
              <Upload className="h-3.5 w-3.5" />
              Add
            </button>
          ) : null}

          {!readOnly && isOwner ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-default text-secondary transition hover:bg-[var(--color-bg-tertiary)] hover:text-foreground"
                ariaLabel={`Folder actions for ${folder.name}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem
                  onClick={() => {
                    setIsRenaming(true);
                  }}
                  className="flex items-center gap-2 border-b border-default text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsDeleteOpen(true);
                  }}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Folder"
        description={`Are you sure you want to delete "${folder.name}"? This action cannot be undone.`}
        itemNameToConfirm={folder.name}
      />
    </>
  );
}
