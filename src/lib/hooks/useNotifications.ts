"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/api/notification.api";

export function useGetNotifications() {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getNotifications(),
  });

  return {
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetUnreadCount() {
  const query = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => notificationApi.getUnreadCount(),
  });

  return {
    unreadCount: query.data ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
