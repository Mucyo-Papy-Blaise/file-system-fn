"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "@/api/invitation.api";
import { InvitationStatus } from "@/types/enum";
import type {
  AcceptInvitationInput,
  InviteMemberInput,
} from "@/types/schema/invitation.schema";

export function useGetInvitations(status?: InvitationStatus) {
  const query = useQuery({
    queryKey: ["invitations", status],
    queryFn: () => invitationApi.getInvitations(status),
  });

  return {
    invitations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useGetInvitationDetails(token: string) {
  const query = useQuery({
    queryKey: ["invitation", token],
    queryFn: () => invitationApi.getInvitationDetails(token),
    enabled: !!token,
  });

  return {
    invitation: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: InviteMemberInput) => invitationApi.inviteMember(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invitations"] });
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

export function useCancelInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => invitationApi.cancelInvitation(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["invitations"] });
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

export function useAcceptInvitation() {
  const mutation = useMutation({
    mutationFn: (data: AcceptInvitationInput & { token: string }) =>
      invitationApi.acceptInvitation(data),
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
