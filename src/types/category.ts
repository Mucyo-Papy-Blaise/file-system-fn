export interface Category {
  id: string;
  name: string;
  slug: string;
  companyId: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoryListResponse {
  categories: Category[];
  pagination: CategoryPagination;
}

export interface CategoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  name: string;
}

export interface CategoryListResponseEnvelope {
  success: boolean;
  data: {
    data: Array<{
      id: string;
      name: string;
      slug?: string;
      companyId?: string;
      organizationId?: string;
      documentCount?: number;
      createdAt: string;
      updatedAt: string;
    }>;
    meta: CategoryPagination;
  };
  timestamp?: string;
}

export interface CategoryResponseEnvelope {
  success: boolean;
  data: {
    id: string;
    name: string;
    slug?: string;
    companyId?: string;
    organizationId?: string;
    documentCount?: number;
    createdAt: string;
    updatedAt: string;
  };
  timestamp?: string;
}
