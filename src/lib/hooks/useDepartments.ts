"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "@/api/department.api";
import type {
  CreateDepartmentInput,
  Department,
  InviteAdminInput,
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

export function useGetDepartmentById(id: string) {
  const query = useQuery({
    queryKey: ["departments", id],
    queryFn: () => departmentApi.getDepartmentById(id),
    enabled: !!id,
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
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentInput }) =>
      departmentApi.updateDepartment(id, data),
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

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => departmentApi.deleteDepartment(id),
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

export function useInviteAdmin() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InviteAdminInput }) =>
      departmentApi.inviteAdmin(id, data),
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
