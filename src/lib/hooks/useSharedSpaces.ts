"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sharedSpaceApi } from "@/api/shared-space.api";
import type {
  CreateSharedSpaceInput,
  UpdateSharedSpaceInput,
} from "@/types/shared-space";

export function useGetSharedSpaces() {
  const query = useQuery({
    queryKey: ["shared-spaces"],
    queryFn: () => sharedSpaceApi.getSharedSpaces(),
  });

  return {
    sharedSpaces: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetSharedSpaceById(id: string) {
  const query = useQuery({
    queryKey: ["shared-spaces", id],
    queryFn: () => sharedSpaceApi.getSharedSpaceById(id),
    enabled: Boolean(id),
  });

  return {
    sharedSpace: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useCreateSharedSpace() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateSharedSpaceInput) =>
      sharedSpaceApi.createSharedSpace(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shared-spaces"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useUpdateSharedSpace() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSharedSpaceInput }) =>
      sharedSpaceApi.updateSharedSpace(id, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["shared-spaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["shared-spaces", variables.id],
      });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useDeleteSharedSpace() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => sharedSpaceApi.deleteSharedSpace(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shared-spaces"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useShareDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      spaceId,
      documentId,
    }: {
      spaceId: string;
      documentId: string;
    }) => sharedSpaceApi.shareDocument(spaceId, documentId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["shared-spaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["shared-spaces", variables.spaceId],
      });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useRemoveSharedDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      spaceId,
      documentId,
    }: {
      spaceId: string;
      documentId: string;
    }) => sharedSpaceApi.removeDocument(spaceId, documentId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["shared-spaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["shared-spaces", variables.spaceId],
      });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useReplaceDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      spaceId,
      documentId,
      newDocumentId,
    }: {
      spaceId: string;
      documentId: string;
      newDocumentId: string;
    }) =>
      sharedSpaceApi.replaceDocument(spaceId, documentId, newDocumentId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["shared-spaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["shared-spaces", variables.spaceId],
      });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
