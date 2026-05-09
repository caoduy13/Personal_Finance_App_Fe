import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants";
import type { CurrentUser } from "./types";

const PROFILE_STRATEGY = {
  me: "real" as RequestMode,
} as const;

interface BackendMePayload {
  id: string;
  userName?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  preferredCurrency?: string | null;
  isOnboardingCompleted?: boolean;
}

function mapToCurrentUser(raw: unknown): CurrentUser {
  if (raw == null || typeof raw !== "object") {
    throw new Error("INVALID_ME");
  }
  const r = raw as BackendMePayload & Record<string, unknown>;
  let firstName = String(r.firstName ?? "").trim();
  let lastName = String(r.lastName ?? "").trim();
  if (!firstName && !lastName && typeof r.fullName === "string") {
    const parts = r.fullName.trim().split(/\s+/).filter(Boolean);
    firstName = parts[0] ?? "";
    lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  }
  const username = String(r.username ?? r.userName ?? "").trim();
  return {
    id: String(r.id ?? ""),
    username: username || r.email,
    firstName,
    lastName,
    email: String(r.email ?? ""),
    phone: r.phone != null ? String(r.phone) : null,
    avatarUrl: r.avatarUrl != null ? String(r.avatarUrl) : null,
    preferredCurrency: String(r.preferredCurrency ?? "VND"),
    isOnboardingCompleted: Boolean(r.isOnboardingCompleted),
  };
}

export const profileService = {
  async getMe(): Promise<CurrentUser> {
    const realRequest = async () =>
      mapToCurrentUser(await apiClient.get<unknown>(API_ENDPOINT.USER.ME));

    const mockRequest = async () => {
      await wait(250);
      const row = mockData.profile.getMe();
      return {
        id: row.id,
        username: row.username,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        avatarUrl: row.avatarUrl,
        preferredCurrency: row.preferredCurrency,
        isOnboardingCompleted: row.isOnboardingCompleted,
      };
    };

    return requestWithStrategy(PROFILE_STRATEGY.me, realRequest, mockRequest);
  },
};
