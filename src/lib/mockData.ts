export interface MockDocument {
  id: string;
  fileName: string;
  category: string;
  folder: string;
  uploadedBy: string;
  date: string;
  folderId?: string;
}

export interface MockFolder {
  id: string;
  name: string;
  parentId: string | null;
  itemCount: number;
  createdBy: string;
  createdAt: string;
}

export const mockCategories = [
  {
    id: "c1",
    name: "Finance",
    documentCount: 12,
    createdAt: "2026-01-09",
  },
  {
    id: "c2",
    name: "Legal",
    documentCount: 8,
    createdAt: "2026-01-12",
  },
  {
    id: "c3",
    name: "Operations",
    documentCount: 5,
    createdAt: "2026-01-18",
  },
  {
    id: "c4",
    name: "Human Resources",
    documentCount: 7,
    createdAt: "2026-01-22",
  },
];

export const mockMembers = [
  {
    id: "m1",
    name: "Alice Uwimana",
    email: "alice.uwimana@example.com",
    role: "ADMIN",
    createdAt: "2026-01-05",
  },
  {
    id: "m2",
    name: "Eric Niyonzima",
    email: "eric.niyonzima@example.com",
    role: "MEMBER",
    createdAt: "2026-02-12",
  },
  {
    id: "m3",
    name: "Grace Irakoze",
    email: "grace.irakoze@example.com",
    role: "MEMBER",
    createdAt: "2026-02-20",
  },
  {
    id: "m4",
    name: "Jean Claude",
    email: "jean.claude@example.com",
    role: "MEMBER",
    createdAt: "2026-03-01",
  },
];

export const mockFolders: MockFolder[] = [
  // Root level folders
  { id: "f-root", name: "Home", parentId: null, itemCount: 3, createdBy: "System", createdAt: "2026-01-01" },
  { id: "f1", name: "Finance", parentId: "f-root", itemCount: 2, createdBy: "Alice Uwimana", createdAt: "2026-01-15" },
  { id: "f-contracts", name: "Contracts", parentId: "f-root", itemCount: 1, createdBy: "Alice Uwimana", createdAt: "2026-01-20" },
  { id: "f-hr", name: "HR Policies", parentId: "f-root", itemCount: 1, createdBy: "Grace Irakoze", createdAt: "2026-01-25" },
  { id: "f-ops", name: "Operations", parentId: "f-root", itemCount: 1, createdBy: "Jean Claude", createdAt: "2026-02-01" },
  
  // Finance subfolder: 2024
  { id: "f2", name: "2024", parentId: "f1", itemCount: 2, createdBy: "Alice Uwimana", createdAt: "2026-01-16" },
  
  // Finance/2024 subfolders: Q1, Q2
  { id: "f3", name: "Q1", parentId: "f2", itemCount: 1, createdBy: "Eric Niyonzima", createdAt: "2026-02-01" },
  { id: "f4", name: "Q2", parentId: "f2", itemCount: 0, createdBy: "Eric Niyonzima", createdAt: "2026-02-15" },
];

export const mockDocuments: MockDocument[] = [
  {
    id: "d1",
    fileName: "Board Resolution.pdf",
    category: "Legal",
    folder: "Contracts",
    uploadedBy: "Alice Uwimana",
    date: "2026-05-10",
    folderId: "f-contracts",
  },
  {
    id: "d2",
    fileName: "Q1 Cashflow.xlsx",
    category: "Finance",
    folder: "Finance Reports",
    uploadedBy: "Eric Niyonzima",
    date: "2026-05-09",
    folderId: "f3",
  },
  {
    id: "d3",
    fileName: "Leave Policy.docx",
    category: "Human Resources",
    folder: "HR Policies",
    uploadedBy: "Grace Irakoze",
    date: "2026-05-08",
    folderId: "f-hr",
  },
  {
    id: "d4",
    fileName: "Warehouse Checklist.pdf",
    category: "Operations",
    folder: "Operations",
    uploadedBy: "Jean Claude",
    date: "2026-05-07",
    folderId: "f-ops",
  },
];
