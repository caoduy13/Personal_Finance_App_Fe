/**
 * baseURL rỗng + path tuyệt đối trên từng service; dev dùng Vite proxy theo prefix BE.
 * `VITE_FORCE_MOCK=true` ép mock toàn cục (xem requestStrategy).
 */
const API_URL = import.meta.env.VITE_API_URL ?? "";

export const env = {
  API_URL,
  FORCE_MOCK: import.meta.env.VITE_FORCE_MOCK === "true",
  DEV_PREFILL_LOGIN_EMAIL:
    import.meta.env.VITE_DEV_PREFILL_LOGIN_EMAIL?.trim() ?? "",
  DEV_PREFILL_LOGIN_PASSWORD:
    typeof import.meta.env.VITE_DEV_PREFILL_LOGIN_PASSWORD === "string"
      ? import.meta.env.VITE_DEV_PREFILL_LOGIN_PASSWORD
      : "",
} as const;
