import type { AxiosError } from "axios";
import axios from "axios";
import { apiBare } from "@/lib/axios";
import type { AuthResponse } from "./types";
import type { UserRole } from "@/shared/types";

interface BackendAuthShape {
  id: string;
  username?: string;
  accessToken?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const JWT_ROLE_KEYS = [
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  "role",
] as const;

function normalizeRoleFromJwt(accessToken: string): UserRole {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return "user";
  for (const key of JWT_ROLE_KEYS) {
    const raw = payload[key];
    if (typeof raw === "string") {
      const normalized = normalizeRole(raw);
      if (normalized) return normalized;
    }
    if (Array.isArray(raw) && typeof raw[0] === "string") {
      const normalized = normalizeRole(raw[0]);
      if (normalized) return normalized;
    }
  }
  return "user";
}

function normalizeRole(role: string): UserRole | null {
  const r = role.trim().toLowerCase();
  if (r.includes("super")) return "admin";
  if (r === "admin" || r === "administrator") return "admin";
  if (r === "user" || r === "member") return "user";
  return null;
}

function buildFullName(me: BackendMeResponse): string {
  const parts = [me.firstName, me.lastName]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);
  return parts.join(" ").trim() || me.email;
}

export async function buildAuthResponse(
  bootstrap: BackendAuthShape,
): Promise<AuthResponse> {
  const accessToken = bootstrap.accessToken?.trim();
  if (!accessToken) {
    throw new Error("Thiếu access token trong phản hồi đăng nhập.");
  }

  const role = normalizeRoleFromJwt(accessToken);

  const meResponse = await apiBare.get<BackendMeResponse>("/User/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const me = meResponse.data;

  return {
    accessToken,
    user: {
      id: me.id ?? bootstrap.id,
      email: me.email ?? bootstrap.email ?? "",
      fullName: buildFullName(me),
      role,
      isOnboardingCompleted: me.isOnboardingCompleted ?? false,
    },
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
