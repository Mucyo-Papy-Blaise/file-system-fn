"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SetupCategoriesModal } from "@/components/categories/SetupCategoriesModal";
import { UploadDrawer } from "@/components/upload/UploadDrawer";
import { DashboardProvider } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { useOrganizationSetup } from "@/lib/hooks/useOrganizationSetup";
import { Role } from "@/types/enum";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/search": "Search",
  "/dashboard/my-folders": "My Folders",
  "/dashboard/folders": "Folders",
  "/dashboard/inbox": "Inbox",
  "/dashboard/documents": "My Documents",
  "/dashboard/categories": "Categories",
  "/dashboard/collections": "Collections",
  "/dashboard/members": "Members",
  "/dashboard/company": "Company Settings",
  "/dashboard/staff": "Staff",
};

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] ?? "Dashboard";
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isSetupComplete, isLoading: isOrganizationSetupLoading } = useOrganizationSetup();
  const [isModalCompleted, setIsModalCompleted] = useState(false);

  const showSetupModal =
    !isAuthLoading &&
    !isOrganizationSetupLoading &&
    user?.role === Role.ADMIN &&
    !isSetupComplete &&
    !isModalCompleted;

  return (
    <DashboardProvider>
      <SetupCategoriesModal
        isOpen={showSetupModal}
        onClose={() => {
          /* intentionally disabled while setup is required */
        }}
        onSuccess={() => setIsModalCompleted(true)}
        disableClose={true}
      />
      <DashboardLayout pageTitle={pageTitle}>
        {children}
      </DashboardLayout>
    </DashboardProvider>
  );
}
