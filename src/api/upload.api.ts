import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";

export interface UploadResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
}

export const uploadApi = {
  async uploadFile(formData: FormData): Promise<UploadResponse> {
    const response = await apiClient.postFormData<
      ApiSuccessEnvelope<UploadResponse>
    >("/upload", formData);

    return response.data;
  },
};
