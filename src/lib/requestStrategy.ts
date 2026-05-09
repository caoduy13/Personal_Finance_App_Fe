import { env } from "@/lib/env";

export type RequestMode = "real" | "mock";

export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Chọn giữa request thật và mock theo cờ per-endpoint.
 *
 * Cờ rollback toàn cục `VITE_FORCE_MOCK=true` sẽ ép tất cả về mock,
 * dùng khi BE down hoặc cần dev offline.
 */
export async function requestWithStrategy<T>(
  mode: RequestMode,
  realRequest: () => Promise<T>,
  mockRequest: () => Promise<T>,
): Promise<T> {
  if (env.FORCE_MOCK || mode === "mock") {
    return mockRequest();
  }

  return realRequest();
}
