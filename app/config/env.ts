const normalizeBaseUrl = (value?: string) => {
  if (!value) return "";
  return value.replace(/\/+$/, "");
};

const DEFAULT_API_BASE_URL = "http://localhost:8001";

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
);

export const ASSET_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_ASSET_BASE_URL || API_BASE_URL
);
