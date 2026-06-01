import type { Collection } from "./collection";
import type { Document } from "./document";
import { Role } from "./enum";

export interface ShareUser {
  id: string;
  name: string;
  role: Role;
}

export interface ShareReply {
  id: string;
  message: string;
  createdAt: string;
  user: ShareUser;
}

export interface DocumentShare {
  id: string;
  message?: string | null;
  isRead: boolean;
  expiresAt: string;
  createdAt: string;
  sharedBy: ShareUser;
  sharedTo: ShareUser;
  document?: Document;
  collection?: Collection;
  replies: ShareReply[];
}

export interface CreateShareInput {
  recipientIds: string[];
  message?: string;
  documentId?: string;
  collectionId?: string;
}

export interface ReplyShareInput {
  message: string;
}
