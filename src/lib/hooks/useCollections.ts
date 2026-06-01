"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "@/api/collection.api";
import {
  invalidateTrashRelatedQueries,
  showMovedToTrashToast,
} from "@/lib/trash-toast";
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
    collections: query.data?.private ?? [],
    sharedCollections: query.data?.shared ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetCollectionBySlug(slug: string) {
  const query = useQuery({
    queryKey: ["collections", slug],
    queryFn: () => collectionApi.getCollectionBySlug(slug),
    enabled: Boolean(slug),
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
    mutationFn: ({ slug, data }: { slug: string; data: UpdateCollectionInput }) =>
      collectionApi.updateCollection(slug, data),
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
    mutationFn: (slug: string) => collectionApi.deleteCollection(slug),
    onSuccess: async (trashItem) => {
      await invalidateTrashRelatedQueries(queryClient);
      showMovedToTrashToast(trashItem.id, queryClient);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useAddDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      collectionSlug,
      documentId,
    }: {
      collectionSlug: string;
      documentId: string;
    }) => collectionApi.addDocument(collectionSlug, documentId),
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
      collectionSlug,
      documentId,
    }: {
      collectionSlug: string;
      documentId: string;
    }) => collectionApi.removeDocument(collectionSlug, documentId),
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
