"use client";

import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/my-folders": "My Folders",
  "/dashboard/folders": "Folders",
  "/dashboard/documents": "My Documents",
  "/dashboard/categories": "Categories",
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

  return <DashboardLayout pageTitle={pageTitle}>{children}</DashboardLayout>;
}
