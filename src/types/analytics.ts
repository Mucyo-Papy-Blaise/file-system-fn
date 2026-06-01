export interface Stats {
  totalDocuments: number;
  totalFolders: number;
  totalMembers?: number;
  totalDepartments?: number;
  totalCategories?: number;
  totalCollections: number;
  totalBranches?: number;
  pendingInbox: number;
}

export interface DocumentOverTime {
  month: string;
  count: number;
}

export interface DocumentByCategory {
  category: string;
  count: number;
}

export interface DocumentByDepartment {
  department: string;
  count: number;
}

export interface MemberActivity {
  name: string;
  count: number;
  role: string;
  department?: string;
}

export interface StorageData {
  used: number;
  total: number;
  percentage: number;
}

export interface RecentFolder {
  id: string;
  name: string;
  createdBy: string;
  documentCount: number;
  createdAt: string;
}

export interface RecentDocument {
  id: string;
  fileName: string;
  title: string | null;
  category: string | null;
  uploadedBy: string;
  createdAt: string;
}
