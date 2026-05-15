import { apiClient } from "@/api/api-client";

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export const healthApi = {
  check: (): Promise<HealthResponse> => apiClient.get<HealthResponse>("/health"),
};
