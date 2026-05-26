import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
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

export const analyticsApi = {
  async getStats(): Promise<Stats> {
    const response = await apiClient.get<ApiSuccessEnvelope<Stats>>(`/analytics/stats`);
    return response.data;
  },

  async getDocumentsOverTime(period: "6months" | "12months") {
    const response = await apiClient.get<ApiSuccessEnvelope<DocumentOverTime[]>>(
      `/analytics/documents-over-time?period=${period}`,
    );
    return response.data;
  },

  async getDocumentsByCategory() {
    const response = await apiClient.get<ApiSuccessEnvelope<DocumentByCategory[]>>(
      `/analytics/documents-by-category`,
    );
    return response.data;
  },

  async getDocumentsByDepartment() {
    const response = await apiClient.get<ApiSuccessEnvelope<DocumentByDepartment[]>>(
      `/analytics/documents-by-department`,
    );
    return response.data;
  },

  async getMemberActivity() {
    const response = await apiClient.get<ApiSuccessEnvelope<MemberActivity[]>>(
      `/analytics/member-activity`,
    );
    return response.data;
  },

  async getStorage() {
    const response = await apiClient.get<ApiSuccessEnvelope<StorageData>>(`/analytics/storage`);
    return response.data;
  },

  async getDepartmentStats(id: string, period: "6months" | "12months") {
    const response = await apiClient.get<ApiSuccessEnvelope<any>>(
      `/analytics/department/${id}?period=${period}`,
    );
    return response.data;
  },

  async getRecentFolders() {
    const response = await apiClient.get<ApiSuccessEnvelope<RecentFolder[]>>(
      `/analytics/recent-folders`,
    );
    return response.data;
  },

  async getRecentDocuments() {
    const response = await apiClient.get<ApiSuccessEnvelope<RecentDocument[]>>(
      `/analytics/recent-documents`,
    );
    return response.data;
  },
};
