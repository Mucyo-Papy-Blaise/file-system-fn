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

export function CategoryCard({
  category,
  onDelete,
  isDeleting = false,
}: CategoryCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleConfirmDelete = async () => {
    await onDelete(category.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <div className="grid items-center gap-4 border-b border-default px-4 py-4 text-sm text-foreground md:grid-cols-[2.5fr_1fr_1fr_auto]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-bg-secondary)] text-primary">
            <Tag className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{category.name}</p>
            <p className="mt-1 truncate text-xs text-secondary">
              {category.description ?? "Category"}
            </p>
          </div>
        </div>

        <div className="truncate text-secondary">{category.documentCount ?? 0} documents</div>

        <div className="truncate text-secondary">{category.createdAt}</div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            disabled={isDeleting}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-default bg-surface text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleConfirmDelete()}
        title="Delete Category"
        description={`Are you sure you want to delete the category "${category.name}"? All associated data will be permanently removed.`}
        itemNameToConfirm={category.name}
      />
    </>
  );
}
