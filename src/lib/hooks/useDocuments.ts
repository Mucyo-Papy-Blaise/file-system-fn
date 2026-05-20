"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentApi } from "@/api/document.api";
import type {
  CreateDocumentInput,
  DocumentFilters,
  MoveDocumentInput,
  RenameDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";

export function useProcessDocument() {
  const mutation = useMutation({
    mutationFn: (extractedText: string) =>
      documentApi.processDocument(extractedText),
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

export function useGetDocuments(filters?: DocumentFilters) {
  const query = useQuery({
    queryKey: ["documents", filters],
    queryFn: () => documentApi.getDocuments(filters),
  });

  return {
    documents: query.data?.documents ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetDocumentById(id: string) {
  const query = useQuery({
    queryKey: ["documents", id],
    queryFn: () => documentApi.getDocumentById(id),
    enabled: Boolean(id),
  });

  return {
    document: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateDocumentInput) =>
      documentApi.createDocument(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
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

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentInput }) =>
      documentApi.updateDocument(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => documentApi.deleteDocument(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
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

export function useBulkUpload() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (files: Array<{ fileUrl: string; fileName: string }>) =>
      documentApi.bulkUpload(files),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["inbox"] });
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

export function useMoveToFolder() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, folderId }: { id: string; folderId: string }) =>
      documentApi.moveToFolder(id, { folderId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["inbox"] });
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
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

export function useRenameDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, fileName }: { id: string; fileName: string }) =>
      documentApi.renameDocument(id, { fileName }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["inbox"] });
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

export function useGetInbox() {
  const query = useQuery({
    queryKey: ["inbox"],
    queryFn: () => documentApi.getInbox(),
  });

  return {
    documents: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
