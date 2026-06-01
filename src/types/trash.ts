export enum TrashItemType {
  DOCUMENT = "DOCUMENT",
  FOLDER = "FOLDER",
  COLLECTION = "COLLECTION",
  SHARED_SPACE = "SHARED_SPACE",
}

export interface TrashItem {
  id: string;
  type: TrashItemType;
  name: string;
  itemCount: number;
  deletedAt: string;
  expiresAt: string;
  daysRemaining?: number;
  documentId?: string | null;
  folderId?: string | null;
  collectionId?: string | null;
  sharedSpaceId?: string | null;
}
