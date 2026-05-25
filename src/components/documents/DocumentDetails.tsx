"use client";

import { createPortal } from "react-dom";
import {
  Download,
  ExternalLink,
  FileText,
  Folder,
  User,
  CalendarDays,
  Tag,
  FileSearch,
  Info,
  Clock,
  X,
} from "lucide-react";
import type { Document } from "@/types/document";

type NullableId = { id?: string | null; name?: string | null };

type NullablePartial<T> = {
  [P in keyof T]?: T[P] | null;
};

type DocumentDetailsModel = Omit<NullablePartial<Document>, "category" | "folder" | "uploadedBy"> & {
  category?: string | NullableId | null;
  folder?: string | NullableId | null;
  uploadedBy?: string | NullableId | null;
};

interface DocumentDetailsProps {
  document?: DocumentDetailsModel | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onDownload?: () => void;
  isLoading?: boolean;
}

function getCategoryName(category?: string | NullableId | null) {
  if (!category) return "Uncategorized";
  const name = typeof category === "string" ? category : category.name ?? "";
  return name?.trim() || "Uncategorized";
}

function getFolderName(folder?: string | NullableId | null) {
  if (!folder) return "Unassigned";
  const name = typeof folder === "string" ? folder : folder.name ?? "";
  return name?.trim() || "Unassigned";
}

function getUploaderName(uploadedBy?: string | NullableId | null) {
  if (!uploadedBy) return "Unknown";
  const name = typeof uploadedBy === "string" ? uploadedBy : uploadedBy.name ?? "";
  return name?.trim() || "Unknown";
}

function formatDetailValue(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function getFileMeta(fileName: string | undefined) {
  const extension = fileName?.split(".").pop()?.toLowerCase() ?? "";

  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return { label: "Image file", icon: <FileText className="h-5 w-5 text-sky-600" /> };
    case "xls":
    case "xlsx":
    case "csv":
      return { label: "Spreadsheet", icon: <FileText className="h-5 w-5 text-emerald-600" /> };
    case "pdf":
      return { label: "PDF document", icon: <FileText className="h-5 w-5 text-red-600" /> };
    default:
      return { label: extension ? `${extension.toUpperCase()} file` : "Document", icon: <FileText className="h-5 w-5 text-slate-600" /> };
  }
}

export function DocumentDetails({ document, isOpen, onClose, onOpen, onDownload, isLoading = false }: DocumentDetailsProps) {
  const portalTarget = typeof window !== "undefined" ? window.document.body : null;

  if (!isOpen || !portalTarget) return null;

  const fileMeta = getFileMeta(document?.fileName ?? "");

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close document details backdrop"
        className="fixed inset-0 z-[90] bg-black/50"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-[91] h-screen w-full max-w-[720px] overflow-y-auto border-l border-black/10 bg-surface shadow-[var(--shadow-xl)]">
        <div className="sticky top-0 z-[92] flex justify-end bg-surface px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
            aria-label="Close document details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-5 pb-5 pt-0 sm:px-7 sm:pb-7">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-3/4 rounded-xl bg-surface" />
              <div className="grid gap-3 sm:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-20 rounded bg-[var(--color-bg-secondary)]" />
                ))}
              </div>
            </div>
          ) : !document ? (
            <div className="rounded border border-default bg-[var(--color-bg-secondary)] p-6 text-sm text-secondary">
              Document details are not available.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded border border-default bg-surface p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded bg-[var(--color-bg-secondary)]">
                    {fileMeta.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.24em] text-secondary">{fileMeta.label}</p>
                    <h3 className="truncate text-xl font-semibold text-foreground">
                      {document.title || document.fileName}
                    </h3>
                    <p className="truncate text-sm text-secondary">{document.fileName}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-secondary">Uploaded by</p>
                    <p className="text-base font-medium text-foreground">{getUploaderName(document.uploadedBy)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onOpen}
                      disabled={!onOpen}
                      className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={onDownload}
                      disabled={!onDownload}
                      className="inline-flex items-center gap-2 rounded border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)] disabled:opacity-50"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <Folder className="h-4 w-4" />
                    Folder
                  </div>
                  <p className="mt-3 text-sm text-foreground">{getFolderName(document.folder)}</p>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <Tag className="h-4 w-4" />
                    Category
                  </div>
                  <p className="mt-3 text-sm text-foreground">{getCategoryName(document.category)}</p>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <User className="h-4 w-4" />
                    Document owner
                  </div>
                  <p className="mt-3 text-sm text-foreground">
                    {formatDetailValue(document.documentOwner, "Not specified")}
                  </p>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <User className="h-4 w-4" />
                    Author
                  </div>
                  <p className="mt-3 text-sm text-foreground">
                    {formatDetailValue(document.author, "Unknown")}
                  </p>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <Info className="h-4 w-4" />
                    Concerning
                  </div>
                  <p className="mt-3 text-sm text-foreground">
                    {formatDetailValue(document.concerning, "Not specified")}
                  </p>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <FileSearch className="h-4 w-4" />
                    Purpose
                  </div>
                  <p className="mt-3 text-sm text-foreground">
                    {formatDetailValue(document.purpose, "Not specified")}
                  </p>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <CalendarDays className="h-4 w-4" />
                    Document date
                  </div>
                  <p className="mt-3 text-sm text-foreground">
                    {formatDetailValue(document.documentDate, "Not set")}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <Clock className="h-4 w-4" />
                    Created
                  </div>
                  <p className="mt-3 text-sm text-foreground">
                    {document.createdAt
                      ? new Date(document.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <Clock className="h-4 w-4" />
                    Updated
                  </div>
                  <p className="mt-3 text-sm text-foreground">
                    {document.updatedAt
                      ? new Date(document.updatedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : document.createdAt
                      ? new Date(document.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded border border-default bg-surface p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                  <FileSearch className="h-4 w-4" />
                  Summary
                </div>
                <p className="text-sm leading-6 text-foreground">
                  {formatDetailValue(document.summary, "No summary available.")}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>,
    portalTarget
  );
}
