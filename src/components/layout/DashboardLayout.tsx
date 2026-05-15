"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "@/lib/auth-context";

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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        pathname={pathname}
        user={user}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <TopBar
          pageTitle={pageTitle}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
