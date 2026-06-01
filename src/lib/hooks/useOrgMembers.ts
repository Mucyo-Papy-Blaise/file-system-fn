"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user.api";

export function useGetOrgMembers() {
  const query = useQuery({
    queryKey: ["org-members"],
    queryFn: () => userApi.getOrganizationMembers(),
  });

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
