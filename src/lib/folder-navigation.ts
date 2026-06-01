export const FOLDER_BROWSER_PATHS = [
  "/dashboard/my-folders",
  "/dashboard/folders",
] as const;

export type FolderBrowserPath = (typeof FOLDER_BROWSER_PATHS)[number];

export function isFolderBrowserPath(pathname: string): pathname is FolderBrowserPath {
  return (FOLDER_BROWSER_PATHS as readonly string[]).includes(pathname);
}

const STORAGE_PREFIX = "file-vault:folder:";

export function folderNavStorageKey(pathname: string) {
  return `${STORAGE_PREFIX}${pathname}`;
}

export function readStoredFolderSlug(pathname: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return sessionStorage.getItem(folderNavStorageKey(pathname));
  } catch {
    return null;
  }
}

export function writeStoredFolderSlug(
  pathname: string,
  slug: string | null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const key = folderNavStorageKey(pathname);
    if (slug) {
      sessionStorage.setItem(key, slug);
    } else {
      sessionStorage.removeItem(key);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearFolderNavForPath(pathname: string): void {
  writeStoredFolderSlug(pathname, null);
}

export function buildFolderQueryString(
  pathname: string,
  slug: string | null,
): string {
  if (!slug) {
    return pathname;
  }

  const params = new URLSearchParams();
  params.set("folder", slug);
  return `${pathname}?${params.toString()}`;
}

/** Remove ?folder= from the current URL (same pathname). */
export function stripFolderSearchParam(pathname: string): string {
  return pathname;
}
