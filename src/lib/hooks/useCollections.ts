"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "@/api/collection.api";
import type {
  CreateCollectionInput,
  Collection,
  UpdateCollectionInput,
} from "@/types/collection";

export function useGetCollections() {
  const query = useQuery({
    queryKey: ["collections"],
    queryFn: () => collectionApi.getCollections(),
  });

  return {
    collections: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetCollectionById(id: string) {
  const query = useQuery({
    queryKey: ["collections", id],
    queryFn: () => collectionApi.getCollectionById(id),
    enabled: Boolean(id),
  });

  return {
    collection: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateCollectionInput) =>
      collectionApi.createCollection(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionInput }) =>
      collectionApi.updateCollection(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => collectionApi.deleteCollection(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useAddDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      collectionId,
      documentId,
    }: {
      collectionId: string;
      documentId: string;
    }) => collectionApi.addDocument(collectionId, documentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useRemoveDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      collectionId,
      documentId,
    }: {
      collectionId: string;
      documentId: string;
    }) => collectionApi.removeDocument(collectionId, documentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
