import { ASSET_BASE_URL } from "@/app/config/env";

export const buildAssetUrl = (path?: string | null): string | null => {
  if (!path) return null;

  let normalized = path.replace(/\\/g, "/").replace(/\/{2,}/g, "/");

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:")
  ) {
    return normalized;
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  if (!ASSET_BASE_URL) {
    return normalized;
  }

  return `${ASSET_BASE_URL}${normalized}`;
};
