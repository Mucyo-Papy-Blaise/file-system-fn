"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/profile/ImageUploadField";
import { OrgPageHeader } from "@/components/org/OrgPageHeader";
import { UnderlineField } from "@/components/auth/Underlinefield";
import { useAuth } from "@/lib/auth-context";
import { useUpdateProfile } from "@/lib/hooks/useProfile";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function DashboardProfilePage() {
  const { user, refreshUser, isLoading: isAuthLoading } = useAuth();
  const { mutate: updateProfile, isLoading: isSaving } = useUpdateProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setPhone(user.phone ?? "");
    setProfileImage(user.profileImage ?? null);
  }, [user]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    updateProfile(
      {
        name: trimmedName,
        phone: phone.trim() || undefined,
        profileImage,
      },
      {
        onSuccess: async () => {
          await refreshUser();
          toast.success("Profile updated");
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Unable to update profile.";
          toast.error(message);
        },
      },
    );
  };

  if (isAuthLoading || !user) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
        <div className="h-64 animate-pulse rounded-2xl bg-[var(--color-bg-secondary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <OrgPageHeader
        title="My Profile"
        description="Update your name, phone, and profile photo. Email cannot be changed here."
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-default bg-surface p-6 shadow-sm sm:p-8"
      >
        <ImageUploadField
          label="Profile photo"
          description="Uploads immediately. Save the form to apply it to your account."
          value={profileImage}
          onChange={setProfileImage}
          purpose="profile"
          fallbackInitials={getInitials(name || user.name)}
          disabled={isSaving}
        />

        <div className="space-y-6">
          <UnderlineField
            id="profile-name"
            label="Full name"
            type="text"
            value={name}
            onChange={setName}
            disabled={isSaving}
          />

          <UnderlineField
            id="profile-email"
            label="Email"
            type="email"
            value={user.email}
            onChange={() => {}}
            disabled
          />

          <UnderlineField
            id="profile-phone"
            label="Phone (optional)"
            type="tel"
            value={phone}
            onChange={setPhone}
            disabled={isSaving}
          />
        </div>

        <div className="flex justify-end border-t border-default pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
