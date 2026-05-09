/** Gốc API kèm `/api/v1` — axios ghép thêm path trong `API_ENDPOINT` (không lặp `/api/v1`). */
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

if (!API_URL) {
  throw new Error(
    "❌ MISSING ENVIRONMENT VARIABLE: VITE_API_URL\n" +
      "Please create .env file with: VITE_API_URL=http://localhost:3000/api/v1",
  );
}

const DEV_PREFILL_LOGIN_EMAIL = String(
  import.meta.env.VITE_DEV_PREFILL_LOGIN_EMAIL ?? "",
);
const DEV_PREFILL_LOGIN_PASSWORD = String(
  import.meta.env.VITE_DEV_PREFILL_LOGIN_PASSWORD ?? "",
);

export const env = {
  API_URL,
  DEV_PREFILL_LOGIN_EMAIL,
  DEV_PREFILL_LOGIN_PASSWORD,
} as const;
