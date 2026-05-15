"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const AUTH_PAGES = new Set(["/login", "/register"]);

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = AUTH_PAGES.has(pathname);

    if (isAuthenticated && isAuthPage) {
      router.replace("/dashboard");
      return;
    }

    if (!isAuthenticated && pathname.startsWith("/dashboard")) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-secondary">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
