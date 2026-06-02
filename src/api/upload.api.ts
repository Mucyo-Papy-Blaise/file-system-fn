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

export type ImageUploadPurpose = "profile" | "logo";

export const uploadApi = {
  async uploadFile(formData: FormData): Promise<UploadResponse> {
    const response = await apiClient.postFormData<
      ApiSuccessEnvelope<UploadResponse>
    >("/upload", formData);

    return response.data;
  },

  /** Upload image immediately; does not require saving profile/org form. */
  async uploadImage(
    file: File,
    purpose: ImageUploadPurpose = "profile",
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.postFormData<
      ApiSuccessEnvelope<UploadResponse>
    >(`/upload/image?purpose=${purpose}`, formData);

    return response.data;
  },
};
