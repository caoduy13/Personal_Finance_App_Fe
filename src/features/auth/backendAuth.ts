import type { AxiosError } from "axios";
import axios from "axios";
import { apiClient } from "@/lib/axios";
import type { AuthResponse } from "./types";
import { API_ENDPOINT } from "@/shared/constants";

interface BackendAuthShape {
  id: string;
  username?: string;
  accessToken?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  role?: string | null;
}

interface BackendMeResponse {
  id: string;
  userName?: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  preferredCurrency?: string;
  isOnboardingCompleted?: boolean;
  role?: string | null;
}

/** Full name từ form đăng ký → first/last đúng contract BE (Swagger). */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "User", lastName: "Finjar" };
  if (parts.length === 1) {
    const p = parts[0]!;
    return { firstName: p, lastName: p };
  }
  return { firstName: parts[0]!, lastName: parts.slice(1).join(" ") };
}

export async function buildAuthResponse(
  bootstrap: BackendAuthShape,
): Promise<AuthResponse> {
  const accessToken = bootstrap.accessToken?.trim();
  if (!accessToken) {
    throw new Error("Thiếu access token trong phản hồi đăng nhập.");
  }

  const me = (await apiClient.get<BackendMeResponse>(API_ENDPOINT.USER.ME, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })) as unknown as BackendMeResponse;

  const firstName = (me.firstName ?? "").trim();
  const lastName = (me.lastName ?? "").trim();
  const role =
    me.role ?? bootstrap.role ?? "User";

  return {
    accessToken,
    id: me.id ?? bootstrap.id,
    username:
      me.username?.trim() ??
      me.userName?.trim() ??
      bootstrap.username?.trim() ??
      "",
    firstName,
    lastName,
    email: me.email ?? bootstrap.email ?? "",
    role: String(role),
    isOnboardingCompleted: me.isOnboardingCompleted ?? true,
  };
}

export function mapAxiosAuthError(error: unknown): Error {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error : new Error(String(error));

  const ax = error as AxiosError<{ error?: string; message?: string; title?: string }>;
  const data = ax.response?.data;
  const msg =
    (typeof data === "object" && data?.error && String(data.error)) ||
    (typeof data === "object" && data?.message && String(data.message)) ||
    (typeof data === "object" && data?.title && String(data.title)) ||
    ax.message ||
    "Không đăng nhập được.";
  return new Error(msg);
}
