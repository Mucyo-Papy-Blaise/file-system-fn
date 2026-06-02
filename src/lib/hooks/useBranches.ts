'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { branchApi } from '@/api/branch.api';
import type {
  Branch,
  CreateBranchInput,
  InviteBranchManagerInput,
  UpdateBranchInput,
} from '@/types/branch';

export function useGetBranches() {
  const query = useQuery({
    queryKey: ['branches'],
    queryFn: () => branchApi.getBranches(),
  });

  return {
    branches: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useGetBranchBySlug(slug: string) {
  const query = useQuery({
    queryKey: ['branches', slug],
    queryFn: () => branchApi.getBranchBySlug(slug),
    enabled: !!slug,
  });

  return {
    branch: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateBranchInput) => branchApi.createBranch(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['branches'] });
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

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateBranchInput }) =>
      branchApi.updateBranch(slug, data),
    onSuccess: async (_data: Branch, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['branches'] });
      await queryClient.invalidateQueries({
        queryKey: ['branches', variables.slug],
      });
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

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (slug: string) => branchApi.deleteBranch(slug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['branches'] });
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

export function useInviteBranchManager() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      slug,
      data,
    }: {
      slug: string;
      data: InviteBranchManagerInput;
    }) => branchApi.inviteBranchManager(slug, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['branches'] });
      await queryClient.invalidateQueries({
        queryKey: ['branches', variables.slug],
      });
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
