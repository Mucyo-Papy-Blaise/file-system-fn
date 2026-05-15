"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth-context";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
} from "@/lib/hooks/useCategories";
import { Role } from "@/types/enum";

export default function DashboardCategoriesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories, isLoading: isCategoriesLoading, isError } = useGetCategories({
    page: 1,
    limit: 100,
  });
  const { mutate: createCategory, isLoading: isCreatingCategory } = useCreateCategory();
  const { mutate: deleteCategory, isLoading: isDeletingCategory } = useDeleteCategory();

  useEffect(() => {
    if (!isLoading && user?.role === Role.MEMBER) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, user]);

  const handleAddCategory = async (name: string) => {
    try {
      createCategory(
        { name },
        {
          onSuccess: (category) => {
            toast.success(`Category "${category.name}" created successfully`);
          },
          onError: (error) => {
            const message =
              error instanceof Error ? error.message : "Unable to create category.";
            toast.error(message);
          },
        },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create category.";
      toast.error(message);
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      deleteCategory(categoryId, {
        onSuccess: () => {
          toast.success("Category deleted successfully");
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Unable to delete category.";
          toast.error(message);
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete category.";
      toast.error(message);
    }
  };

  if (isLoading || !user) {
    return null;
  }

  if (isCategoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
            <p className="mt-1 max-w-2xl text-sm text-secondary">
              Manage your document categories and keep the workspace organized.
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-default bg-surface p-6 text-sm text-secondary">
          Loading categories...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
            <p className="mt-1 max-w-2xl text-sm text-secondary">
              Manage your document categories and keep the workspace organized.
            </p>
          </div>
        </div>
        <EmptyState
          title="Unable to load categories"
          description="Try again in a moment."
          actionLabel="Retry"
          onAction={() => router.refresh()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary">
            Manage your document categories and keep the workspace organized.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Add Category
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={{
                ...category,
                createdAt: new Date(category.createdAt).toISOString().split("T")[0],
              }}
              onDelete={handleDeleteCategory}
              isDeleting={isDeletingCategory}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No categories yet"
          description="Create categories to organize documents by topic and team needs."
          actionLabel="Add Category"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddCategory}
        isSubmitting={isCreatingCategory}
      />
    </div>
  );
}
