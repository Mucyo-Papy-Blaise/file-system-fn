"use client";

import { useState } from "react";
import { Tag, Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  onDelete: (categoryId: string) => void | Promise<void>;
  isDeleting?: boolean;
}

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CategoryCard({
  category,
  onDelete,
  isDeleting = false,
}: CategoryCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const documentCount = category.documentCount ?? 0;
  const hasDocuments = documentCount > 0;

  const handleConfirmDelete = async () => {
    await onDelete(category.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <tr className="border-t border-default transition-colors hover:bg-[var(--color-bg-secondary)]/50">
        <td className="px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
              <Tag className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{category.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted">
                {category.slug ? `/${category.slug}` : "Category"}
              </p>
            </div>
          </div>
        </td>

        <td className="px-5 py-4 tabular-nums text-secondary">
          <span
            className={
              documentCount > 0
                ? "font-medium text-foreground"
                : "text-muted"
            }
          >
            {documentCount}
          </span>
          <span className="ml-1 text-muted">
            {documentCount === 1 ? "document" : "documents"}
          </span>
        </td>

        <td className="px-5 py-4 text-secondary">
          {formatCreatedAt(category.createdAt)}
        </td>

        <td className="px-5 py-4 text-right">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            disabled={isDeleting || hasDocuments}
            title={
              hasDocuments
                ? "Reassign documents before deleting this category"
                : `Delete ${category.name}`
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-default bg-surface text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      </tr>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleConfirmDelete()}
        title="Delete Category"
        description={`Are you sure you want to delete "${category.name}"? This cannot be undone.`}
        itemNameToConfirm={category.name}
      />
    </>
  );
}
