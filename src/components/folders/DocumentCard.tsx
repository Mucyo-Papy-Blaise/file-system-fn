"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";

interface DocumentCardProps {
  document: {
    id: string;
    fileName: string;
    category: string;
    date: string;
    uploadedBy: string;
  };
  onDelete?: (documentId: string) => void;
  onView?: (documentId: string) => void;
  onDownload?: (documentId: string) => void;
  isOwner?: boolean;
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-600" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <ImageIcon className="h-5 w-5 text-blue-600" />;
    default:
      return <FileText className="h-5 w-5 text-secondary" />;
  }
}

export function DocumentCard({
  document: file,
  onDelete,
  onView,
  onDownload,
  isOwner = false,
}: DocumentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen && typeof window !== "undefined") {
      window.document.addEventListener("mousedown", handleClickOutside);
      return () =>
        window.document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleConfirmDelete = () => {
    onDelete?.(file.id);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="group relative rounded border border-default bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* Menu Button */}
        {isOwner && (
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

            {isMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 min-w-[140px] overflow-hidden rounded-2xl border border-default bg-surface shadow-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(file.id);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 border-b border-default px-4 py-3 text-sm hover:bg-[var(--color-bg-secondary)]"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload?.(file.id);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 border-b border-default px-4 py-3 text-sm hover:bg-[var(--color-bg-secondary)]"
                >
                  <Download className="h-4 w-4" />
                  Download
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

        {/* Document Icon and Content */}
        <div className="flex flex-col">
          {/* Icon */}
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-bg-secondary)]">
              {getFileIcon(file.fileName)}
            </div>
          </div>

          {/* File Name */}
          <h3 className="mb-3 truncate text-sm font-semibold text-foreground">
            {file.fileName}
          </h3>

          {/* Category Badge */}
          <div className="mb-3">
            <Badge label={file.category} variant="category" />
          </div>

          {/* Date and Uploader */}
          <div className="space-y-1 text-xs text-secondary">
            <p>{formatDate(file.date)}</p>
            <p className="truncate">By {file.uploadedBy}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        description={`Are you sure you want to delete "${file.fileName}"? This action cannot be undone.`}
        itemNameToConfirm={file.fileName}
      />
    </>
  );
}
