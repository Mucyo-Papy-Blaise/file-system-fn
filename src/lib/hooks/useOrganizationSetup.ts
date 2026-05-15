"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useGetCategories } from "@/lib/hooks/useCategories";

const SETUP_COOKIE_NAME = "org_setup_complete";

function readSetupCookie(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .some((part) => part === `${SETUP_COOKIE_NAME}=true`);
}

export function useOrganizationSetup() {
  const { isAuthenticated } = useAuth();
  const [isSetupComplete, setIsSetupComplete] = useState(readSetupCookie());
  const { categories, isLoading } = useGetCategories({ page: 1, limit: 1 });

  useEffect(() => {
    if (!isAuthenticated) {
      setIsSetupComplete(false);
      document.cookie = `${SETUP_COOKIE_NAME}=false; path=/; max-age=0; SameSite=Lax`;
      return;
    }

    if (isLoading) {
      return;
    }

    const hasCategories = categories.length > 0;
    setIsSetupComplete(hasCategories);
    document.cookie = `${SETUP_COOKIE_NAME}=${hasCategories}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }, [categories, isAuthenticated, isLoading]);

  return {
    isSetupComplete,
    isLoading: isAuthenticated ? isLoading : false,
  };
}
