export enum NotificationType {
  DOCUMENT_SHARED = "DOCUMENT_SHARED",
  COLLECTION_SHARED = "COLLECTION_SHARED",
  SHARED_SPACE_UPDATED = "SHARED_SPACE_UPDATED",
  BULK_UPLOAD_READY = "BULK_UPLOAD_READY",
  INVITATION_RECEIVED = "INVITATION_RECEIVED",
  REPLY_RECEIVED = "REPLY_RECEIVED",
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
  type: NotificationType;
}
