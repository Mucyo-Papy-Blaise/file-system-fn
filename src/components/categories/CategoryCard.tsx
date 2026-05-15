"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
      <article className="rounded-3xl border border-default bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Category</p>
            <h3 className="mt-3 text-lg font-semibold text-foreground">{category.name}</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            disabled={isDeleting}
            className="rounded-2xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 text-sm text-secondary">
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-bg-secondary)] p-3">
            <span>Documents</span>
            <span className="font-semibold text-foreground">{category.documentCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-[var(--color-bg-secondary)] p-3">
            <span>Date created</span>
            <span className="font-semibold text-foreground">{category.createdAt}</span>
          </div>
        </div>
      </article>

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
