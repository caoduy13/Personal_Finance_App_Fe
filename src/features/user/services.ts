import { useAuthStore } from "@/features/auth/store";
import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants";
import type {
  UpdateUserProfilePayload,
  UserProfile,
  UserSetupPreview,
} from "./types";

const userRequestMode = (): RequestMode => "real";

function mapBackendMe(raw: unknown): UserProfile {
  if (raw == null || typeof raw !== "object") {
    throw new Error("INVALID_PROFILE");
  }
  const r = raw as Record<string, unknown>;
  let firstName = String(r.firstName ?? "").trim();
  let lastName = String(r.lastName ?? "").trim();
  if (!firstName && !lastName && typeof r.fullName === "string") {
    const parts = r.fullName.trim().split(/\s+/).filter(Boolean);
    firstName = parts[0] ?? "";
    lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  }
  const email = String(r.email ?? "");
  const fullName =
    `${firstName} ${lastName}`.trim() ||
    (typeof r.fullName === "string" ? r.fullName.trim() : "") ||
    email;

  return {
    id: String(r.id ?? ""),
    email,
    userName:
      r.userName != null
        ? String(r.userName)
        : r.username != null
          ? String(r.username)
          : null,
    firstName,
    lastName,
    fullName,
    phone: r.phone != null ? String(r.phone) : null,
    avatarUrl: r.avatarUrl != null ? String(r.avatarUrl) : null,
    preferredCurrency: String(r.preferredCurrency ?? "VND"),
    isOnboardingCompleted: Boolean(r.isOnboardingCompleted),
  };
}

function mockProfileFromStore(): UserProfile {
  const u = useAuthStore.getState().user;
  if (!u) throw new Error("NO_AUTH_USER");

  const acc =
    mockData.tables.accounts.find((a) => a.id === u.id) ??
    mockData.tables.accounts.find((a) => a.email === u.email);

  if (acc) {
    const parts = acc.full_name.trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] ?? "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    return {
      id: acc.id,
      email: acc.email,
      userName: acc.username,
      firstName,
      lastName,
      fullName: acc.full_name,
      phone: acc.phone_number,
      avatarUrl: acc.avatar_url,
      preferredCurrency: acc.preferred_currency ?? "VND",
      isOnboardingCompleted:
        Boolean(acc.is_onboarding_completed) ||
        Boolean(u.isOnboardingCompleted ?? u.is_onboarding_completed),
    };
  }

  const parts = u.fullName.trim().split(/\s+/).filter(Boolean);
  return {
    id: u.id,
    email: u.email,
    userName: null,
    firstName: parts[0] ?? "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
    fullName: u.fullName,
    phone: null,
    avatarUrl: null,
    preferredCurrency: "VND",
    isOnboardingCompleted: Boolean(
      u.isOnboardingCompleted ?? u.is_onboarding_completed,
    ),
  };
}

function onboardingProfileForUser(userId: string) {
  return mockData.tables.onboarding_profiles.find((p) => p.user_id === userId);
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const realRequest = async () => {
      const raw = await apiClient.get<unknown>(API_ENDPOINT.USER.ME);
      return mapBackendMe(raw);
    };

    const mockRequest = async () => {
      await wait(120);
      return mockProfileFromStore();
    };

    return requestWithStrategy(userRequestMode(), realRequest, mockRequest);
  },

  async updateProfile(patch: UpdateUserProfilePayload): Promise<UserProfile> {
    const body = {
      firstName: patch.firstName.trim(),
      lastName: patch.lastName.trim(),
      ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
      ...(patch.avatarUrl !== undefined ? { avatarUrl: patch.avatarUrl } : {}),
    };

    const realRequest = async () => {
      const raw = await apiClient.patch<unknown>(API_ENDPOINT.USER.ME, body);
      return mapBackendMe(raw);
    };

    const mockRequest = async () => {
      await wait(160);
      const base = mockProfileFromStore();
      return mapBackendMe({
        id: base.id,
        email: base.email,
        userName: base.userName,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone ?? base.phone ?? null,
        avatarUrl:
          patch.avatarUrl !== undefined
            ? (patch.avatarUrl ?? null)
            : base.avatarUrl,
        preferredCurrency: base.preferredCurrency,
        isOnboardingCompleted: base.isOnboardingCompleted,
      });
    };

    return requestWithStrategy(userRequestMode(), realRequest, mockRequest);
  },

  async getSetupPreview(): Promise<UserSetupPreview | null> {
    const realRequest = async () =>
      ((await apiClient.get(
        API_ENDPOINT.USER.SETUP,
      )) ?? null) as UserSetupPreview | null;

    const mockRequest = async (): Promise<UserSetupPreview | null> => {
      await wait(100);
      const u = useAuthStore.getState().user;
      if (!u) return null;
      const profile = onboardingProfileForUser(u.id);
      const jarCount = mockData.tables.jars.filter(
        (j) => j.user_id === u.id,
      ).length;
      const financialAccountCount = mockData.tables.financial_accounts.filter(
        (a) => a.user_id === u.id && a.is_active,
      ).length;
      const limitCount = mockData.tables.spending_limits.filter(
        (l) => l.user_id === u.id && l.is_active,
      ).length;
      const activeGoalCount = mockData.tables.goals.filter(
        (g) => g.user_id === u.id && g.status === "Active",
      ).length;

      const acc =
        mockData.tables.accounts.find((a) => a.id === u.id) ??
        mockData.tables.accounts.find((a) => a.email === u.email);

      return {
        isOnboardingCompleted: Boolean(
          acc?.is_onboarding_completed ?? profile?.completed_at,
        ),
        monthlyIncome: profile?.monthly_income ?? null,
        budgetMethodPreference: profile?.budget_method_preference ?? null,
        financialAccountCount,
        jarCount,
        limitCount,
        activeGoalCount,
      };
    };

    return requestWithStrategy(userRequestMode(), realRequest, mockRequest);
  },

  async syncAuthFromServer(): Promise<void> {
    const profile = await this.getProfile();
    useAuthStore.getState().updateUser({
      fullName: profile.fullName,
      email: profile.email,
      isOnboardingCompleted: profile.isOnboardingCompleted,
      is_onboarding_completed: profile.isOnboardingCompleted,
    });
  },
};
