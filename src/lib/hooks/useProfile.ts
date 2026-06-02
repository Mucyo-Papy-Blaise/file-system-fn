"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import type {
  UpdateOrganizationPayload,
  UpdateProfilePayload,
} from "@/types/auth";

export function useUpdateProfile() {
  const mutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authApi.updateProfile(payload),
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useUpdateOrganization() {
  const mutation = useMutation({
    mutationFn: (payload: UpdateOrganizationPayload) =>
      authApi.updateOrganization(payload),
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
