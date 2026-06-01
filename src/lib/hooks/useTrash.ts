"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { trashApi } from "@/api/trash.api";
import { invalidateTrashRelatedQueries } from "@/lib/trash-toast";

export function useGetTrash() {
  const query = useQuery({
    queryKey: ["trash"],
    queryFn: () => trashApi.getTrashItems(),
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useRestoreTrash() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => trashApi.restore(id),
    onSuccess: async () => {
      await invalidateTrashRelatedQueries(queryClient);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function usePermanentDeleteTrash() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => trashApi.permanentDelete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useEmptyTrash() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => trashApi.emptyTrash(),
    onSuccess: async () => {
      await invalidateTrashRelatedQueries(queryClient);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
