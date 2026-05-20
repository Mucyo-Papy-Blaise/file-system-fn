export interface Folder {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdBy: {
    id: string;
    name: string;
  };
  organizationId: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  fileUrl: string;
  fileName: string;
  title: string | null;
  summary: string | null;
  documentOwner?: string | null;
  author?: string | null;
  documentType?: string | null;
  concerning?: string | null;
  purpose?: string | null;
  documentDate?: string | null;
  category: string | { id: string; name: string };
  folder?: string | { id: string; name: string };
  folderId: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderContents {
  folder: Folder;
  children: Folder[];
  documents: Document[];
  breadcrumb: Array<{ id: string; name: string }>;
}

export interface CreateFolderInput {
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderInput {
  name: string;
}
