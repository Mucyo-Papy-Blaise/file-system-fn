"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { folderApi } from "@/api/folder.api";
import type { CreateFolderInput, FolderContents, Folder, UpdateFolderInput } from "@/types/folder";

export function useGetRootFolders(options?: { mine?: boolean }) {
  const query = useQuery({
    queryKey: ["folders", options?.mine ?? false],
    queryFn: () => folderApi.getRootFolders(options),
  });

  return {
    folders: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetFolderContents(id: string | null, options?: { mine?: boolean }) {
  const query = useQuery({
    queryKey: ["folders", id, options?.mine ?? false],
    queryFn: () => folderApi.getFolderContents(id ?? "", options),
    enabled: Boolean(id),
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
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderInput }) =>
      folderApi.updateFolder(id, data),
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
    mutationFn: (id: string) => folderApi.deleteFolder(id),
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
