"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, FolderPlus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { useOrganizationSetup } from "@/lib/hooks/useOrganizationSetup";

const SETUP_COOKIE_NAME = "org_setup_complete";

function Step({
  label,
  state,
}: {
  label: string;
  state: "complete" | "active" | "upcoming";
}) {
  const isComplete = state === "complete";
  const isActive = state === "active";

  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
          isComplete
            ? "border-[#2563eb] bg-[#2563eb] text-white"
            : isActive
              ? "border-[#2563eb] bg-[#dbeafe] text-[#2563eb]"
              : "border-slate-200 bg-white text-slate-400",
        ].join(" ")}
      >
        {isComplete ? <Check className="h-4 w-4" /> : <span />}
      </div>
      <div>
        <p
          className={[
            "text-xs font-semibold uppercase tracking-[0.16em]",
            isActive || isComplete ? "text-[#2563eb]" : "text-slate-400",
          ].join(" ")}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export default function SetupCategoriesPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isSetupComplete, isLoading } = useOrganizationSetup();
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthLoading || isLoading) {
      return;
    }

    if (!user) {
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    if (isSetupComplete) {
      router.replace("/dashboard");
    }
  }, [isAuthLoading, isLoading, isSetupComplete, router, user]);

  const normalizedCategories = useMemo(
    () => new Set(categories.map((category) => category.toLowerCase())),
    [categories],
  );

  const handleAddCategory = () => {
    const trimmedCategory = categoryInput.trim();

    if (!trimmedCategory) {
      toast.error("Enter a category name first.");
      return;
    }

    if (normalizedCategories.has(trimmedCategory.toLowerCase())) {
      toast.error("That category already exists.");
      return;
    }

    setCategories((currentCategories) => [...currentCategories, trimmedCategory]);
    setCategoryInput("");
    toast.success(`Category "${trimmedCategory}" added.`);
  };

  const handleRemoveCategory = (categoryName: string) => {
    setCategories((currentCategories) =>
      currentCategories.filter((category) => category !== categoryName),
    );
    toast.success(`Category "${categoryName}" removed.`);
  };

  const handleContinue = async () => {
    if (categories.length === 0) {
      toast.error("Add at least one category to continue.");
      return;
    }

    setIsSaving(true);

    window.setTimeout(() => {
      document.cookie = `${SETUP_COOKIE_NAME}=true; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      toast.success("Workspace categories saved successfully.");
      router.push("/dashboard");
    }, 1000);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-500">
        Loading setup...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <section className="w-full rounded-[32px] bg-white p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] ring-1 ring-slate-200/70 sm:p-10">
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-4">
              <Step label="Step 1: Create Organization" state="complete" />
              <div className="h-px flex-1 bg-slate-200" />
              <Step label="Step 2: Setup Categories" state="active" />
              <div className="h-px flex-1 bg-slate-200" />
              <Step label="Step 3: Dashboard" state="upcoming" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dbeafe] text-[#2563eb]">
                <FolderPlus className="h-7 w-7" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Welcome! Let&apos;s set up your workspace
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Add at least one document category to continue. Categories help
                classify your documents automatically.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddCategory();
                  }
                }}
                placeholder="Enter category name"
                className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2563eb] px-5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <p className="text-sm font-medium text-slate-700">Added categories</p>
              {categories.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 ring-1 ring-slate-200"
                    >
                      <Badge label={category} variant="category" />
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={`Remove ${category}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No categories added yet.
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex justify-end border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={handleContinue}
              disabled={categories.length === 0 || isSaving}
              className={[
                "inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold transition",
                categories.length === 0 || isSaving
                  ? "cursor-not-allowed bg-slate-300 text-slate-600"
                  : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
              ].join(" ")}
            >
              {isSaving ? "Saving..." : "Continue to Dashboard"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
