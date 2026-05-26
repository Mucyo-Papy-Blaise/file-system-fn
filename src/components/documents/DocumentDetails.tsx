"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
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
import { toast } from "sonner";
import { useGetCategories } from "@/lib/hooks/useCategories";
import { useGetRootFolders } from "@/lib/hooks/useFolders";
import { useUpdateDocument } from "@/lib/hooks/useDocuments";
import type { Document, UpdateDocumentInput } from "@/types/document";

type NullableId = { id?: string | null; name?: string | null };

type NullablePartial<T> = {
  [P in keyof T]?: T[P] | null;
};

type DocumentDetailsModel = Omit<
  NullablePartial<Document>,
  "category" | "folder" | "uploadedBy"
> & {
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

function getUploaderName(uploadedBy?: string | NullableId | null) {
  if (!uploadedBy) return "Unknown";
  const name =
    typeof uploadedBy === "string" ? uploadedBy : (uploadedBy.name ?? "");
  return name?.trim() || "Unknown";
}

function getFileMeta(fileName: string | undefined) {
  const extension = fileName?.split(".").pop()?.toLowerCase() ?? "";

  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return {
        label: "Image file",
        icon: <FileText className="h-5 w-5 text-sky-600" />,
      };
    case "xls":
    case "xlsx":
    case "csv":
      return {
        label: "Spreadsheet",
        icon: <FileText className="h-5 w-5 text-emerald-600" />,
      };
    case "pdf":
      return {
        label: "PDF document",
        icon: <FileText className="h-5 w-5 text-red-600" />,
      };
    default:
      return {
        label: extension ? `${extension.toUpperCase()} file` : "Document",
        icon: <FileText className="h-5 w-5 text-slate-600" />,
      };
  }
}

export function DocumentDetails({
  document,
  isOpen,
  onClose,
  onOpen,
  onDownload,
  isLoading = false,
}: DocumentDetailsProps) {
  const portalTarget =
    typeof window !== "undefined" ? window.document.body : null;
  const updateDocument = useUpdateDocument();
  const { categories, isLoading: isCategoriesLoading } = useGetCategories({
    page: 1,
    limit: 100,
  });
  const { folders, isLoading: isFoldersLoading } = useGetRootFolders({
    mine: true,
  });

  const [formState, setFormState] = useState<UpdateDocumentInput>(() => ({
    title: document?.title ?? document?.fileName ?? "",
    documentOwner: document?.documentOwner ?? undefined,
    author: document?.author ?? undefined,
    documentType: document?.documentType ?? undefined,
    concerning: document?.concerning ?? undefined,
    purpose: document?.purpose ?? undefined,
    documentDate: document?.documentDate ?? undefined,
    summary: document?.summary ?? undefined,
    categoryId:
      document?.category && typeof document.category === "object" && document.category.id != null
        ? document.category.id
        : undefined,
    folderId:
      document?.folder && typeof document.folder === "object" && document.folder.id != null
        ? document.folder.id
        : undefined,
  }));
  const [hasChanges, setHasChanges] = useState(false);

  if (!isOpen || !portalTarget) return null;

  const fileMeta = getFileMeta(document?.fileName ?? "");

  const handleFieldChange = <K extends keyof UpdateDocumentInput>(
    field: K,
    value: UpdateDocumentInput[K],
  ) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!document) return;

    const updatePayload: UpdateDocumentInput = {};
    if (formState.title !== (document.title ?? document.fileName ?? "")) {
      updatePayload.title = formState.title;
    }
    if (formState.documentOwner !== document.documentOwner) {
      updatePayload.documentOwner = formState.documentOwner ?? undefined;
    }
    if (formState.author !== document.author) {
      updatePayload.author = formState.author ?? undefined;
    }
    if (formState.documentType !== document.documentType) {
      updatePayload.documentType = formState.documentType ?? undefined;
    }
    if (formState.concerning !== document.concerning) {
      updatePayload.concerning = formState.concerning ?? undefined;
    }
    if (formState.purpose !== document.purpose) {
      updatePayload.purpose = formState.purpose ?? undefined;
    }
    if (formState.documentDate !== document.documentDate) {
      updatePayload.documentDate = formState.documentDate ?? undefined;
    }
    if (formState.summary !== document.summary) {
      updatePayload.summary = formState.summary ?? undefined;
    }
    if (
      formState.categoryId !==
      (typeof document.category === "object" ? document?.category?.id : undefined)
    ) {
      updatePayload.categoryId = formState.categoryId;
    }
    if (
      formState.folderId !==
      (typeof document.folder === "object" ? document?.folder?.id : undefined)
    ) {
      updatePayload.folderId = formState.folderId;
    }

    if (Object.keys(updatePayload).length === 0) {
      toast("No changes to save.");
      return;
    }

    updateDocument.mutate(
      { id: document.id as string, data: updatePayload },
      {
        onSuccess: () => {
          toast.success("Document details updated.");
          setHasChanges(false);
        },
        onError: () => {
          toast.error("Unable to save document details.");
        },
      },
    );
  };

  const dateValue = formState.documentDate
    ? formState.documentDate.slice(0, 10)
    : "";

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
                  <div
                    key={index}
                    className="h-20 rounded bg-[var(--color-bg-secondary)]"
                  />
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
                    <p className="text-xs uppercase tracking-[0.24em] text-secondary">
                      {fileMeta.label}
                    </p>
                    <input
                      value={formState.title ?? document.fileName ?? ""}
                      onChange={(event) =>
                        handleFieldChange("title", event.target.value)
                      }
                      className="w-full truncate border-none bg-transparent px-0 text-xl font-semibold text-foreground outline-none ring-0 focus:ring-0"
                      placeholder={document.fileName ?? ""}
                    />
                    <p className="truncate text-sm text-secondary">
                      {document.fileName}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-secondary">Uploaded by</p>
                    <p className="text-base font-medium text-foreground">
                      {getUploaderName(document.uploadedBy)}
                    </p>
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
                  <select
                    value={formState.folderId ?? ""}
                    onChange={(event) =>
                      handleFieldChange(
                        "folderId",
                        event.target.value || undefined,
                      )
                    }
                    disabled={isFoldersLoading}
                    className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Unassigned</option>
                    {folders.map((folderOption) => (
                      <option key={folderOption.id} value={folderOption.id}>
                        {folderOption.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <Tag className="h-4 w-4" />
                    Category
                  </div>
                  <select
                    value={formState.categoryId ?? ""}
                    onChange={(event) =>
                      handleFieldChange(
                        "categoryId",
                        event.target.value || undefined,
                      )
                    }
                    disabled={isCategoriesLoading}
                    className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((categoryOption) => (
                      <option key={categoryOption.id} value={categoryOption.id}>
                        {categoryOption.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <User className="h-4 w-4" />
                    Document owner
                  </div>
                  <input
                    value={formState.documentOwner ?? ""}
                    onChange={(event) =>
                      handleFieldChange("documentOwner", event.target.value)
                    }
                    className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Not specified"
                  />
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <User className="h-4 w-4" />
                    Author
                  </div>
                  <input
                    value={formState.author ?? ""}
                    onChange={(event) =>
                      handleFieldChange("author", event.target.value)
                    }
                    className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Unknown"
                  />
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <Info className="h-4 w-4" />
                    Document type
                  </div>
                  <input
                    value={formState.documentType ?? ""}
                    onChange={(event) =>
                      handleFieldChange("documentType", event.target.value)
                    }
                    className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Not specified"
                  />
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <Info className="h-4 w-4" />
                    Concerning
                  </div>
                  <input
                    value={formState.concerning ?? ""}
                    onChange={(event) =>
                      handleFieldChange("concerning", event.target.value)
                    }
                    className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Not specified"
                  />
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <FileSearch className="h-4 w-4" />
                    Purpose
                  </div>
                  <input
                    value={formState.purpose ?? ""}
                    onChange={(event) =>
                      handleFieldChange("purpose", event.target.value)
                    }
                    className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="Not specified"
                  />
                </div>
                <div className="rounded border border-default bg-surface p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                    <CalendarDays className="h-4 w-4" />
                    Document date
                  </div>
                  <input
                    type="date"
                    value={dateValue}
                    onChange={(event) =>
                      handleFieldChange("documentDate", event.target.value)
                    }
                    className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
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
                      ? new Date(document.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
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
                      ? new Date(document.updatedAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : document.createdAt
                        ? new Date(document.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded border border-default bg-surface p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary">
                  <FileSearch className="h-4 w-4" />
                  Summary
                </div>
                <textarea
                  value={formState.summary ?? ""}
                  onChange={(event) =>
                    handleFieldChange("summary", event.target.value)
                  }
                  rows={5}
                  className="mt-3 w-full rounded-lg border border-default bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="No summary available."
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (document) {
                      setFormState({
                        title: document.title ?? document.fileName ?? "",
                        documentOwner: document.documentOwner ?? null,
                        author: document.author ?? null,
                        documentType: document.documentType ?? null,
                        concerning: document.concerning ?? null,
                        purpose: document.purpose ?? null,
                        documentDate: document.documentDate ?? null,
                        summary: document.summary ?? "",
                      });
                      setHasChanges(false);
                    }
                  }}
                  className="rounded border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!hasChanges || updateDocument.isLoading}
                  className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
                >
                  {updateDocument.isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>,
    portalTarget,
  );
}
