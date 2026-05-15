import { User } from "./auth";
import { Category } from "./category";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdBy: User;
  itemCount: number;
  createdAt: string;
}

export interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  title: string;
  summary: string;
  category: Category;
  folder: Folder;
  uploadedBy: User;
  createdAt: string;
}
