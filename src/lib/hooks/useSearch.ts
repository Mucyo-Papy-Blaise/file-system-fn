"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { searchApi } from "@/api/search.api";
import type { SearchFilters } from "@/types/search";

const MIN_GLOBAL_SEARCH_LENGTH = 2;

export function useGlobalSearch(query: string, limit = 5) {
  const [debouncedQuery] = useDebounce(query, 300);

  const queryResult = useQuery({
    queryKey: ["search", "global", debouncedQuery, limit],
    queryFn: () => searchApi.globalQuickSearch(debouncedQuery, limit),
    enabled: debouncedQuery.trim().length >= MIN_GLOBAL_SEARCH_LENGTH,
  });

  const result = queryResult.data;

  return {
    documents: result?.documents.data ?? [],
    folders: result?.folders.data ?? [],
    collections: result?.collections.data ?? [],
    sharedSpaces: result?.sharedSpaces.data ?? [],
    totals: {
      documents: result?.documents.total ?? 0,
      folders: result?.folders.total ?? 0,
      collections: result?.collections.total ?? 0,
      sharedSpaces: result?.sharedSpaces.total ?? 0,
    },
    hasResults:
      (result?.documents.total ?? 0) +
        (result?.folders.total ?? 0) +
        (result?.collections.total ?? 0) +
        (result?.sharedSpaces.total ?? 0) >
      0,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    debouncedQuery,
  };
}

/** @deprecated Use useGlobalSearch — searches documents, folders, collections, and shared spaces */
export function useSearchCollections(query: string) {
  const global = useGlobalSearch(query);
  return {
    collections: global.collections,
    isLoading: global.isLoading,
    isError: global.isError,
  };
}

export function useSearch(filters: SearchFilters) {
  const [debouncedFilters] = useDebounce(filters, 300);

  const queryResult = useQuery({
    queryKey: ["search", debouncedFilters],
    queryFn: () => searchApi.search(debouncedFilters),
    enabled: Boolean(debouncedFilters.query?.trim().length >= 2),
  });

  return {
    searchResult: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
  };
}
