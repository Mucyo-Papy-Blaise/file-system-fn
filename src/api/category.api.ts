import { apiClient } from "@/api/api-client";
import type {
  Category,
  CategoryFilters,
  CategoryListResponse,
  CategoryListResponseEnvelope,
  CategoryResponseEnvelope,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category";

function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type CategoryApiRecord = {
  id: string;
  name: string;
  slug?: string;
  companyId?: string;
  organizationId?: string;
  documentCount?: number;
  createdAt: string;
  updatedAt: string;
};

function normalizeCategory(category: CategoryApiRecord): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug ?? toSlug(category.name),
    companyId: category.companyId ?? category.organizationId ?? "",
    documentCount: category.documentCount ?? 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function buildCategoryPath(filters?: CategoryFilters): string {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.set("search", filters.search);
  }

  if (filters?.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters?.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  const queryString = params.toString();
  return queryString ? `/categories?${queryString}` : "/categories";
}

export const categoryApi = {
  async getCategories(filters?: CategoryFilters): Promise<CategoryListResponse> {
    const response = await apiClient.get<CategoryListResponseEnvelope>(
      buildCategoryPath(filters),
    );

    return {
      categories: response.data.data.map(normalizeCategory),
      pagination: response.data.meta,
    };
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<CategoryResponseEnvelope>(`/categories/${id}`);
    return normalizeCategory(response.data);
  },

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const response = await apiClient.post<CategoryResponseEnvelope, CreateCategoryInput>(
      "/categories",
      data,
    );
    return normalizeCategory(response.data);
  },

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
    const response = await apiClient.patch<CategoryResponseEnvelope, UpdateCategoryInput>(
      `/categories/${id}`,
      data,
    );
    return normalizeCategory(response.data);
  },

  async deleteCategory(id: string): Promise<Category> {
    const response = await apiClient.delete<CategoryResponseEnvelope>(`/categories/${id}`);
    return normalizeCategory(response.data);
  },
};
