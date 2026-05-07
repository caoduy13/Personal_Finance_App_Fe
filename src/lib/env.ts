const DEFAULT_API_URL = "https://personal-finance-management-api.onrender.com";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (rawApiUrl && rawApiUrl.length > 0 ? rawApiUrl : DEFAULT_API_URL).replace(/\/+$/, "");

const FORCE_MOCK = import.meta.env.VITE_FORCE_MOCK === "true";
const USE_REAL_AUTH = import.meta.env.VITE_USE_REAL_AUTH === "true";

export const env = {
  /** API host root, KHÔNG bao gồm /api/v1. Path prefix nằm trong API_ENDPOINT. */
  API_URL,
  /** Cờ rollback toàn bộ về mock data, hữu ích khi BE down. */
  FORCE_MOCK,
  /**
   * Bật gọi BE thật cho auth; đồng thời bật /User/me, onboarding (POST /Onboarding),
   * danh mục (GET /api/v1/categories) khi `VITE_FORCE_MOCK` không ép mock.
   * Khi false: luồng trên vẫn dùng mockData.
   */
  USE_REAL_AUTH,
  DEV_PREFILL_LOGIN_EMAIL: import.meta.env.VITE_DEV_PREFILL_LOGIN_EMAIL?.trim() ?? "",
  DEV_PREFILL_LOGIN_PASSWORD:
    typeof import.meta.env.VITE_DEV_PREFILL_LOGIN_PASSWORD === "string"
      ? import.meta.env.VITE_DEV_PREFILL_LOGIN_PASSWORD
      : "",
} as const;
