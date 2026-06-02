"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { uploadApi, type ImageUploadPurpose } from "@/api/upload.api";

interface ImageUploadFieldProps {
  label: string;
  description?: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  purpose: ImageUploadPurpose;
  fallbackInitials?: string;
  disabled?: boolean;
}

export function ImageUploadField({
  label,
  description,
  value,
  onChange,
  purpose,
  fallbackInitials = "U",
  disabled = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadApi.uploadImage(file, purpose);
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload image.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? (
          <p className="mt-1 text-xs text-secondary">{description}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-default bg-[var(--color-bg-secondary)]">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-primary">
              {fallbackInitials.length <= 2 ? (
                fallbackInitials
              ) : (
                <User className="h-8 w-8 text-muted" />
              )}
            </div>
          )}
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-default bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Camera className="h-4 w-4" />
            {value ? "Change image" : "Upload image"}
          </button>

          {value ? (
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={handleRemove}
              className="inline-flex items-center gap-2 rounded-lg border border-default px-4 py-2 text-sm text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
    </div>
  );
}
