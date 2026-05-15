import {
  type DefaultOptions,
  QueryClient,
} from "@tanstack/react-query";
import { ApiError } from "@/api/api-client";

export const defaultQueryOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && [401, 403].includes(error.status))
        return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: true,
  },
  mutations: {
    retry: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});
