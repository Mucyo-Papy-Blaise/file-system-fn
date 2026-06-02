"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "@/api/department.api";
import type {
  CreateDepartmentInput,
  Department,
  InviteDeptManagerInput,
  UpdateDepartmentInput,
} from "@/types/department";

export function useGetDepartments() {
  const query = useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentApi.getDepartments(),
  });

  return {
    departments: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useGetDepartmentBySlug(slug: string) {
  const query = useQuery({
    queryKey: ["departments", slug],
    queryFn: () => departmentApi.getDepartmentBySlug(slug),
    enabled: !!slug,
  });

  return {
    department: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateDepartmentInput) => departmentApi.createDepartment(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
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

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateDepartmentInput }) =>
      departmentApi.updateDepartment(slug, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
      await queryClient.invalidateQueries({
        queryKey: ["departments", variables.slug],
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

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (slug: string) => departmentApi.deleteDepartment(slug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
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

export function useInviteDeptManager() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: InviteDeptManagerInput }) =>
      departmentApi.inviteDeptManager(slug, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
      await queryClient.invalidateQueries({
        queryKey: ["departments", variables.slug],
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
