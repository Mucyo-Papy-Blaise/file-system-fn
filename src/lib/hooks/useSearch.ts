"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { searchApi } from "@/api/search.api";
import type { SearchFilters } from "@/types/search";

export function useSearchCollections(query: string) {
  const [debouncedQuery] = useDebounce(query, 300);

  const queryResult = useQuery({
    queryKey: ["search", "collections", debouncedQuery],
    queryFn: () => searchApi.searchCollections(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  return {
    collections: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
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
