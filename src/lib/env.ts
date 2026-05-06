const DEFAULT_API_URL = "https://personal-finance-management-api.onrender.com";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (rawApiUrl && rawApiUrl.length > 0 ? rawApiUrl : DEFAULT_API_URL).replace(/\/+$/, "");

const FORCE_MOCK = import.meta.env.VITE_FORCE_MOCK === "true";

export const env = {
  /** API host root, KHÔNG bao gồm /api/v1. Path prefix nằm trong API_ENDPOINT. */
  API_URL,
  /** Cờ rollback toàn bộ về mock data, hữu ích khi BE down. */
  FORCE_MOCK,
} as const;
