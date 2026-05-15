"use client";

import { useState, useRef, useEffect } from "react";
import { Folder, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { usePathname } from "next/navigation";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    itemCount: number;
    createdBy: string;
  };
  onOpen: (folderId: string) => void;
  onRename?: (folderId: string, newName: string) => void;
  onRenameComplete?: (folderId: string, finalName: string) => void;
  onDelete?: (folderId: string) => void;
  isOwner?: boolean;
  startInRenameMode?: boolean;
}

export function FolderCard({
  folder,
  onOpen,
  onRename,
  onRenameComplete,
  onDelete,
  isOwner = false,
  startInRenameMode = false,
}: FolderCardProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isFoldersRootPage = pathname === "/dashboard/folders";

  const canModify = isOwner;

  if (startInRenameMode && !hasInitialized) {
    setIsRenaming(true);
    setNewName(folder.name);
    setHasInitialized(true);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleRename = () => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      setNewName(folder.name);
      setIsRenaming(false);
      setIsMenuOpen(false);
      return;
    }

    if (trimmedName !== folder.name && onRename) {
      onRename(folder.id, trimmedName);
    }

    setNewName(trimmedName);
    setIsRenaming(false);
    setIsMenuOpen(false);
    onRenameComplete?.(folder.id, trimmedName);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(folder.id);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={() => !isRenaming && onOpen(folder.id)}
        className="group relative rounded border border-default bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      >
        {/* Menu Button */}
        {canModify && (
          <div
            ref={menuRef}
            className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="rounded-2xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-default bg-surface shadow-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenaming(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 border-b border-default px-4 py-3 text-sm hover:bg-[var(--color-bg-secondary)]"
                >
                  <Edit2 className="h-4 w-4" />
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* Folder Icon and Content */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-bg-secondary)]">
              <Folder className="h-5 w-5 text-primary" />
            </div>
          </div>

          {/* Folder Name - Rename Mode */}
          {isRenaming ? (
            <div
              className="mb-2 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setIsRenaming(false);
                    setNewName(folder.name);
                  }
                }}
                className="flex-1 rounded-2xl border border-primary bg-primary-subtle px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <h3 className="mb-3 truncate text-lg font-semibold text-foreground">
              {folder.name}
            </h3>
          )}

          {/* Folder Info */}
          <div className="space-y-2 text-sm text-secondary">
            <p>
              {folder.itemCount === 1 ? "1 item" : `${folder.itemCount} items`}
            </p>
            {isFoldersRootPage && (
              <p className="truncate text-xs">By {folder.createdBy}</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Folder"
        description={`Are you sure you want to delete the folder "${folder.name}"? This action cannot be undone.`}
        itemNameToConfirm={folder.name}
      />
    </>
  );
}
