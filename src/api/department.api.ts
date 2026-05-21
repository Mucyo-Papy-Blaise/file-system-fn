import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  Department,
  CreateDepartmentInput,
  InviteAdminInput,
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

  async getDepartmentById(id: string): Promise<Department> {
    const response = await apiClient.get<ApiSuccessEnvelope<DepartmentApiRecord>>(
      `/departments/${encodeURIComponent(id)}`,
    );
    return normalizeDepartment(response.data);
  },

  async updateDepartment(id: string, data: UpdateDepartmentInput): Promise<Department> {
    const response = await apiClient.patch<
      ApiSuccessEnvelope<DepartmentApiRecord>,
      UpdateDepartmentInput
    >(`/departments/${encodeURIComponent(id)}`, data);
    return normalizeDepartment(response.data);
  },

  async deleteDepartment(id: string): Promise<void> {
    await apiClient.delete<void>(`/departments/${encodeURIComponent(id)}`);
  },

  async inviteAdmin(id: string, data: InviteAdminInput): Promise<void> {
    await apiClient.post<void>(`/departments/${encodeURIComponent(id)}/invite-admin`, data);
  },
};
