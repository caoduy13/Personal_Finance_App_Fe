import { apiClient } from "@/lib/axios";
import { mockData, type MockAccount } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import type {
  AdminUserDetail,
  AdminUserItem,
  AdminUserOnboardingSummary,
  AdminUserRoleCode,
  AdminUserStats,
  AdminUserStatus,
  AdminUsersListParams,
  AdminUsersListResult,
} from "./types";

const ADMIN_USER_STRATEGY = {
  list: "mock" as RequestMode,
  detail: "mock" as RequestMode,
  ban: "mock" as RequestMode,
  unban: "mock" as RequestMode,
} as const;

const SUPER_ADMIN_ID = "8f55ef7a-2d66-4a77-b00f-aec4c5db52f0";

const buildRoleMap = (): Map<number, AdminUserRoleCode> => {
  return new Map(
    mockData.tables.roles.map((role) => [
      role.id,
      role.code === "ADMIN" ? "ADMIN" : "USER",
    ]),
  );
};

const toListItem = (
  account: MockAccount,
  roleMap: Map<number, AdminUserRoleCode>,
): AdminUserItem => ({
  id: account.id,
  username: account.username,
  email: account.email,
  fullName: account.full_name,
  phoneNumber: account.phone_number,
  avatarUrl: account.avatar_url,
  status: account.status,
  roleCode: roleMap.get(account.role_id) ?? "USER",
  isOnboardingCompleted: account.is_onboarding_completed,
  lastLoginAt: account.last_login_at,
  bannedAt: account.banned_at,
  bannedReason: account.banned_reason,
  createdAt: account.created_at,
});

const splitTags = (raw: string | null | undefined): string[] => {
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const buildOnboardingSummary = (
  userId: string,
  isCompleted: boolean,
): AdminUserOnboardingSummary | null => {
  const profile = mockData.tables.onboarding_profiles.find(
    (p) => p.user_id === userId,
  );
  if (!profile) {
    return {
      monthlyIncome: null,
      occupationType: null,
      ageRange: null,
      budgetMethodPreference: null,
      recommendedMethod: null,
      financialGoalTypes: [],
      spendingChallenges: [],
      isCompleted,
    };
  }
  return {
    monthlyIncome: profile.monthly_income ?? null,
    occupationType: profile.occupation_type ?? null,
    ageRange: profile.age_range ?? null,
    budgetMethodPreference: profile.budget_method_preference ?? null,
    recommendedMethod: profile.recommended_method ?? null,
    financialGoalTypes: splitTags(profile.financial_goal_types),
    spendingChallenges: splitTags(profile.spending_challenges),
    isCompleted: Boolean(profile.completed_at) || isCompleted,
  };
};

const buildStats = (userId: string): AdminUserStats => {
  const jarsCount = mockData.tables.jars.filter(
    (j) => j.user_id === userId,
  ).length;
  const transactionsCount = mockData.tables.transactions.filter(
    (t) => t.user_id === userId && !t.is_deleted,
  ).length;
  const totalBalance = mockData.tables.financial_accounts
    .filter((a) => a.user_id === userId && a.is_active)
    .reduce((sum, a) => sum + (a.current_balance ?? 0), 0);
  return { jarsCount, transactionsCount, totalBalance };
};

const filterAndSort = (
  items: AdminUserItem[],
  params: AdminUsersListParams,
): AdminUserItem[] => {
  const search = params.search?.trim().toLowerCase() ?? "";
  const roleFilter = params.role ?? "all";
  const statusFilter = params.status ?? "all";
  const sortBy = params.sortBy ?? "createdAt";
  const sortDir = params.sortDir ?? "desc";

  let result = items;

  if (search) {
    result = result.filter(
      (u) =>
        u.fullName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.username.toLowerCase().includes(search),
    );
  }

  if (roleFilter !== "all") {
    const wanted: AdminUserRoleCode = roleFilter === "admin" ? "ADMIN" : "USER";
    result = result.filter((u) => u.roleCode === wanted);
  }

  if (statusFilter !== "all") {
    const wanted: AdminUserStatus =
      statusFilter === "banned" ? "Banned" : "Active";
    result = result.filter((u) => u.status === wanted);
  }

  const dir = sortDir === "asc" ? 1 : -1;
  return [...result].sort((a, b) => {
    if (sortBy === "fullName") return a.fullName.localeCompare(b.fullName) * dir;
    if (sortBy === "email") return a.email.localeCompare(b.email) * dir;
    return (
      (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
    );
  });
};

const paginate = (
  items: AdminUserItem[],
  page: number,
  pageSize: number,
): AdminUserItem[] => {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

const writeAuditLog = (
  entityId: string,
  action: "LOCK_USER" | "UNLOCK_USER",
  description: string,
) => {
  mockData.tables.audit_logs.push({
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actor_account_id: SUPER_ADMIN_ID,
    action_type: action,
    entity_type: "accounts",
    entity_id: entityId,
    description,
    ip_address: "127.0.0.1",
    created_at: new Date().toISOString(),
  });
};

export const adminUserService = {
  async list(
    params: AdminUsersListParams = {},
  ): Promise<AdminUsersListResult> {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.max(1, params.pageSize ?? 10);

    const realRequest = async () => {
      const query = new URLSearchParams();
      if (params.search) query.set("search", params.search);
      if (params.role && params.role !== "all") query.set("role", params.role);
      if (params.status && params.status !== "all")
        query.set("status", params.status);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.sortDir) query.set("sortDir", params.sortDir);
      query.set("page", String(page));
      query.set("pageSize", String(pageSize));
      const url = `/api/v1/admin/users?${query.toString()}`;
      return (await apiClient.get<AdminUsersListResult>(
        url,
      )) as unknown as AdminUsersListResult;
    };

    const mockRequest = async (): Promise<AdminUsersListResult> => {
      await wait(200);
      const roleMap = buildRoleMap();
      const all = mockData.tables.accounts.map((a) => toListItem(a, roleMap));
      const filtered = filterAndSort(all, params);
      const paged = paginate(filtered, page, pageSize);
      return { items: paged, total: filtered.length, page, pageSize };
    };

    return requestWithStrategy(
      ADMIN_USER_STRATEGY.list,
      realRequest,
      mockRequest,
    );
  },

  async getById(id: string): Promise<AdminUserDetail> {
    const realRequest = async () =>
      (await apiClient.get<AdminUserDetail>(
        `/api/v1/admin/users/${id}`,
      )) as unknown as AdminUserDetail;

    const mockRequest = async (): Promise<AdminUserDetail> => {
      await wait(180);
      const account = mockData.tables.accounts.find((a) => a.id === id);
      if (!account) throw new Error("USER_NOT_FOUND");
      const roleMap = buildRoleMap();
      const base = toListItem(account, roleMap);
      return {
        ...base,
        preferredCurrency: account.preferred_currency,
        bannedByAdminId: account.banned_by_admin_id,
        onboarding: buildOnboardingSummary(
          account.id,
          account.is_onboarding_completed,
        ),
        stats: buildStats(account.id),
      };
    };

    return requestWithStrategy(
      ADMIN_USER_STRATEGY.detail,
      realRequest,
      mockRequest,
    );
  },

  async ban(id: string, reason: string): Promise<AdminUserDetail> {
    const realRequest = async () =>
      (await apiClient.post<AdminUserDetail>(
        `/api/v1/admin/users/${id}/ban`,
        { reason },
      )) as unknown as AdminUserDetail;

    const mockRequest = async (): Promise<AdminUserDetail> => {
      await wait(220);
      const account = mockData.tables.accounts.find((a) => a.id === id);
      if (!account) throw new Error("USER_NOT_FOUND");
      if (account.role_id === 1) throw new Error("CANNOT_BAN_ADMIN");
      account.status = "Banned";
      account.banned_at = new Date().toISOString();
      account.banned_reason = reason;
      account.banned_by_admin_id = SUPER_ADMIN_ID;
      account.updated_at = new Date().toISOString();
      writeAuditLog(id, "LOCK_USER", reason);
      return adminUserService.getById(id);
    };

    return requestWithStrategy(
      ADMIN_USER_STRATEGY.ban,
      realRequest,
      mockRequest,
    );
  },

  async unban(id: string): Promise<AdminUserDetail> {
    const realRequest = async () =>
      (await apiClient.post<AdminUserDetail>(
        `/api/v1/admin/users/${id}/unban`,
      )) as unknown as AdminUserDetail;

    const mockRequest = async (): Promise<AdminUserDetail> => {
      await wait(220);
      const account = mockData.tables.accounts.find((a) => a.id === id);
      if (!account) throw new Error("USER_NOT_FOUND");
      account.status = "Active";
      account.banned_at = null;
      account.banned_reason = null;
      account.banned_by_admin_id = null;
      account.updated_at = new Date().toISOString();
      writeAuditLog(id, "UNLOCK_USER", "Mở khóa tài khoản từ admin portal");
      return adminUserService.getById(id);
    };

    return requestWithStrategy(
      ADMIN_USER_STRATEGY.unban,
      realRequest,
      mockRequest,
    );
  },
};
