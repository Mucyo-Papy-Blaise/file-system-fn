import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  Department,
  CreateDepartmentInput,
  InviteDeptManagerInput,
  UpdateDepartmentInput,
} from "@/types/department";

type DepartmentApiRecord = Department;

function normalizeDepartment(department: DepartmentApiRecord): Department {
  return department;
}

export const departmentApi = {
  async createDepartment(data: CreateDepartmentInput): Promise<Department> {
    const response = await apiClient.post<
      ApiSuccessEnvelope<DepartmentApiRecord>,
      CreateDepartmentInput
    >("/departments", data);

    return normalizeDepartment(response.data);
  },

  async getDepartments(): Promise<Department[]> {
    const response = await apiClient.get<
      ApiSuccessEnvelope<{ data: DepartmentApiRecord[]; meta: unknown }>
    >("/departments");

    return response.data.data.map(normalizeDepartment);
  },

  async getDepartmentBySlug(slug: string): Promise<Department> {
    const response = await apiClient.get<ApiSuccessEnvelope<DepartmentApiRecord>>(
      `/departments/${encodeURIComponent(slug)}`,
    );
    return normalizeDepartment(response.data);
  },

  async updateDepartment(slug: string, data: UpdateDepartmentInput): Promise<Department> {
    const response = await apiClient.patch<
      ApiSuccessEnvelope<DepartmentApiRecord>,
      UpdateDepartmentInput
    >(`/departments/${encodeURIComponent(slug)}`, data);
    return normalizeDepartment(response.data);
  },

  async deleteDepartment(slug: string): Promise<void> {
    await apiClient.delete<void>(`/departments/${encodeURIComponent(slug)}`);
  },

  async inviteDeptManager(
    slug: string,
    data: InviteDeptManagerInput,
  ): Promise<void> {
    await apiClient.post<void>(
      `/departments/${encodeURIComponent(slug)}/invite-dept-manager`,
      data,
    );
  },
};
