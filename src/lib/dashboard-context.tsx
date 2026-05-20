"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface DashboardContextType {
  isUploadOpen: boolean;
  uploadFolderId: string | null;
  openUpload: (folderId?: string | null) => void;
  closeUpload: () => void;
  setUploadFolderId: (folderId: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFolderId, setUploadFolderId] = useState<string | null>(null);

  return (
    <DashboardContext.Provider
      value={{
        isUploadOpen,
        uploadFolderId,
        openUpload: (folderId?: string | null) => {
          setUploadFolderId(folderId ?? null);
          setIsUploadOpen(true);
        },
        closeUpload: () => {
          setIsUploadOpen(false);
          setUploadFolderId(null);
        },
        setUploadFolderId,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
