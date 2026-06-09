"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sharingApi } from "@/api/sharing.api";
import type { CreateShareInput, ReplyShareInput } from "@/types/sharing";
import { isShareExpired } from "@/lib/format-time";

export function useGetInbox() {
  const query = useQuery({
    queryKey: ["inbox"],
    queryFn: () => sharingApi.getInbox(),
    refetchInterval: 60_000,
    select: (shares) => shares.filter((share) => !isShareExpired(share.expiresAt)),
  });

  return {
    shares: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetShareById(shareId: string) {
  const query = useQuery({
    queryKey: ["share", shareId],
    queryFn: () => sharingApi.getShareById(shareId),
    enabled: Boolean(shareId),
  });

  return {
    share: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useGetSent() {
  const query = useQuery({
    queryKey: ["sent"],
    queryFn: () => sharingApi.getSent(),
  });

  return {
    shares: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useShareDocument() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateShareInput) => sharingApi.shareDocument(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inbox"] });
      await queryClient.invalidateQueries({ queryKey: ["sent"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useReplyToShare() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReplyShareInput }) =>
      sharingApi.replyToShare(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inbox"] });
      await queryClient.invalidateQueries({ queryKey: ["sent"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useMarkShareAsRead() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => sharingApi.markAsRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useDeleteShare() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => sharingApi.deleteShare(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inbox"] });
      await queryClient.invalidateQueries({ queryKey: ["sent"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
