import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type {
  Department,
  CreateDepartmentInput,
  InviteDeptManagerInput,
  UpdateDepartmentInput,
} from "@/types/department";
import type { Member } from "@/types/member";

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

  async getDepartmentBySlug(
    slug: string,
    options?: { page?: number; limit?: number },
  ): Promise<Department> {
    const params = new URLSearchParams({
      page: String(options?.page ?? 1),
      limit: String(options?.limit ?? 100),
    });
    const response = await apiClient.get<
      ApiSuccessEnvelope<
        DepartmentApiRecord & {
          users?:
            | Member[]
            | { data: Member[]; meta: { total: number } };
        }
      >
    >(`/departments/${encodeURIComponent(slug)}?${params.toString()}`);

    const { users: usersPayload, ...rest } = response.data;
    const members = Array.isArray(usersPayload)
      ? usersPayload
      : (usersPayload?.data ?? []);
    const memberCount =
      rest.memberCount ??
      (Array.isArray(usersPayload)
        ? usersPayload.length
        : (usersPayload?.meta?.total ?? members.length));

    return normalizeDepartment({
      ...rest,
      members,
      memberCount,
    });
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
