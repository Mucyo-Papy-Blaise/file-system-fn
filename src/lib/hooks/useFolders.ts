"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { folderApi } from "@/api/folder.api";
import {
  invalidateTrashRelatedQueries,
  showMovedToTrashToast,
} from "@/lib/trash-toast";
import type { CreateFolderInput, FolderContents, Folder, UpdateFolderInput } from "@/types/folder";

export function useGetRootFolders(options?: { mine?: boolean; enabled?: boolean }) {
  const query = useQuery({
    queryKey: ["folders", options?.mine ?? false],
    queryFn: () => folderApi.getRootFolders(options),
    enabled: options?.enabled ?? true,
  });

  return {
    folders: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetFolderContents(slug: string | null, options?: { mine?: boolean }) {
  const query = useQuery({
    queryKey: ["folders", slug, options?.mine ?? false],
    queryFn: () => folderApi.getFolderContents(slug ?? "", options),
    enabled: Boolean(slug),
  });

  return {
    folderContents: query.data as FolderContents | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateFolderInput) => folderApi.createFolder(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateFolderInput }) =>
      folderApi.updateFolder(slug, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (slug: string) => folderApi.deleteFolder(slug),
    onSuccess: async (trashItem) => {
      await invalidateTrashRelatedQueries(queryClient);
      showMovedToTrashToast(trashItem.id, queryClient);
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
