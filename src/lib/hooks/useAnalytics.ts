"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analytics.api";
import type {
  Stats,
  DocumentOverTime,
  DocumentByCategory,
  DocumentByDepartment,
  MemberActivity,
  StorageData,
  RecentFolder,
  RecentDocument,
} from "@/types/analytics";

export function useGetStats() {
  const query = useQuery({
    queryKey: ["analytics", "stats"],
    queryFn: () => analyticsApi.getStats(),
  });

  return {
    stats: query.data as Stats | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetDocumentsOverTime(period: "6months" | "12months") {
  const query = useQuery({
    queryKey: ["analytics", "over-time", period],
    queryFn: () => analyticsApi.getDocumentsOverTime(period),
  });

  return {
    data: query.data as DocumentOverTime[] | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetDocumentsByCategory() {
  const query = useQuery({
    queryKey: ["analytics", "by-category"],
    queryFn: () => analyticsApi.getDocumentsByCategory(),
  });

  return {
    data: query.data as DocumentByCategory[] | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetDocumentsByDepartment() {
  const query = useQuery({
    queryKey: ["analytics", "by-department"],
    queryFn: () => analyticsApi.getDocumentsByDepartment(),
  });

  return {
    data: query.data as DocumentByDepartment[] | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetMemberActivity() {
  const query = useQuery({
    queryKey: ["analytics", "member-activity"],
    queryFn: () => analyticsApi.getMemberActivity(),
  });

  return {
    data: query.data as MemberActivity[] | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetStorage() {
  const query = useQuery({
    queryKey: ["analytics", "storage"],
    queryFn: () => analyticsApi.getStorage(),
  });

  return {
    data: query.data as StorageData | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetDepartmentStats(id?: string) {
  const query = useQuery({
    queryKey: ["analytics", "department", id],
    queryFn: () => analyticsApi.getDepartmentStats(id ?? "", "6months"),
    enabled: Boolean(id),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetRecentFolders() {
  const query = useQuery({
    queryKey: ["analytics", "recent-folders"],
    queryFn: () => analyticsApi.getRecentFolders(),
  });

  return {
    data: query.data as RecentFolder[] | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useGetRecentDocuments() {
  const query = useQuery({
    queryKey: ["analytics", "recent-documents"],
    queryFn: () => analyticsApi.getRecentDocuments(),
  });

  return {
    data: query.data as RecentDocument[] | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
