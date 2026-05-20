"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { categoryApi } from "@/api/category.api";
import type { CategoryFilters, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

export function useGetCategories(filters?: CategoryFilters) {
  const query = useQuery({
    queryKey: ["categories", filters],
    queryFn: () => categoryApi.getCategories(filters),
  });

  return {
    categories: query.data?.categories ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    pagination: query.data?.pagination,
  };
}

export function useGetCategoryById(id: string) {
  const query = useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: Boolean(id),
  });

  return {
    category: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryApi.createCategory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useBulkCreateCategories() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (categories: string[]) =>
      apiClient.post<{ success: boolean }>("/categories/bulk", {
        categories,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
