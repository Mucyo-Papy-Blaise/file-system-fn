"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { UploadDrawer } from "@/components/upload/UploadDrawer";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function DashboardLayout({
  children,
  pageTitle,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isUploadOpen, closeUpload, openUpload, setUploadFolderId, uploadFolderId } = useDashboard();

  useEffect(() => {
    setUploadFolderId(null);
  }, [pathname, setUploadFolderId]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        pathname={pathname}
        user={user}
        onClose={() => setIsSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className={cn(
          "min-h-screen transition-[padding] duration-300 ease-out",
          sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-72",
        )}
      >
        <TopBar
          pageTitle={pageTitle}
          onMenuClick={() => setIsSidebarOpen(true)}
          onUploadClick={openUpload}
        />
        <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
          {children}
        </main>
      </div>

      <UploadDrawer
        isOpen={isUploadOpen}
        onClose={closeUpload}
        folderId={uploadFolderId}
      />
    </div>
  );
}
