import { apiBare, apiClient } from "@/lib/axios";
import { mockData, type MockAccount } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import type {
  AdminUserDetail,
  AdminUserDetailApiPayload,
  AdminUserItem,
  AdminUserOnboardingSummary,
  AdminUserRoleCode,
  AdminUserStats,
  AdminUserStatus,
  AdminUsersListParams,
  AdminUsersListResult,
} from "./types";

/** Một dòng trong `GET /api/v1/admin/users` (API V2 + tương thích field mở rộng). */
interface AdminUsersListApiRow {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: AdminUserStatus;
  isOnboardingCompleted: boolean;
  jarCount: number;
  transactionCount: number;
  lastLoginAt: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  bannedReason: string | null;
  createdAt: string | null;
}

function normalizeAdminUsersListRow(raw: unknown): AdminUsersListApiRow | null {
  if (raw == null || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = r.id != null ? String(r.id) : "";
  if (!id) return null;
  const status: AdminUserStatus =
    r.status === "Banned" || r.status === "Active" ? r.status : "Active";
  return {
    id,
    username: String(r.username ?? r.userName ?? "").trim(),
    firstName: String(r.firstName ?? ""),
    lastName: String(r.lastName ?? ""),
    email: String(r.email ?? ""),
    status,
    isOnboardingCompleted: Boolean(r.isOnboardingCompleted),
    jarCount: Number(r.jarCount ?? 0) || 0,
    transactionCount: Number(r.transactionCount ?? 0) || 0,
    lastLoginAt: r.lastLoginAt != null ? String(r.lastLoginAt) : null,
    phoneNumber: r.phone != null ? String(r.phone) : null,
    avatarUrl: r.avatarUrl != null ? String(r.avatarUrl) : null,
    bannedReason: r.statusReason != null ? String(r.statusReason) : null,
    createdAt: r.createdAt != null ? String(r.createdAt) : null,
  };
}

function parseAdminUsersListResponse(raw: unknown): {
  rows: AdminUsersListApiRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
} {
  const empty = {
    rows: [] as AdminUsersListApiRow[],
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  };
  if (raw == null || typeof raw !== "object") return empty;
  const o = raw as Record<string, unknown>;

  let rows: unknown[] = [];
  let pagination: Record<string, unknown> | undefined;

  if (Array.isArray(o.data) && o.pagination && typeof o.pagination === "object") {
    rows = o.data;
    pagination = o.pagination as Record<string, unknown>;
  } else if (o.data != null && typeof o.data === "object" && !Array.isArray(o.data)) {
    const inner = o.data as Record<string, unknown>;
    if (Array.isArray(inner.data)) {
      rows = inner.data;
      pagination =
        inner.pagination && typeof inner.pagination === "object"
          ? (inner.pagination as Record<string, unknown>)
          : undefined;
    }
  } else if (Array.isArray(o.data)) {
    rows = o.data;
    pagination =
      o.pagination && typeof o.pagination === "object"
        ? (o.pagination as Record<string, unknown>)
        : undefined;
  }

  const pag = pagination ?? {};
  const readNum = (obj: Record<string, unknown>, keys: string[]): number | undefined => {
    for (const k of keys) {
      if (!(k in obj) || obj[k] === null || obj[k] === "") continue;
      const n = Number(obj[k]);
      if (!Number.isNaN(n)) return n;
    }
    return undefined;
  };
  const page = readNum(pag, ["page", "PageIndex", "pageIndex"]) ?? 1;
  const pageSize = readNum(pag, ["pageSize", "PageSize"]) ?? 10;
  const totalCount = readNum(pag, ["totalCount", "TotalCount", "total"]);
  const total = totalCount !== undefined ? totalCount : rows.length;
  const parsedTotalPages = readNum(pag, ["totalPages", "TotalPages"]);
  const totalPages =
    parsedTotalPages !== undefined
      ? parsedTotalPages
      : Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));

  const normalizedRows = rows
    .map(normalizeAdminUsersListRow)
    .filter((row): row is AdminUsersListApiRow => row != null);

  return { rows: normalizedRows, page, pageSize, total, totalPages };
}

function mapListApiRow(row: AdminUsersListApiRow): AdminUserItem {
  const firstName = row.firstName?.trim() ?? "";
  const lastName = row.lastName?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || row.username;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    fullName,
    phoneNumber: row.phoneNumber,
    avatarUrl: row.avatarUrl,
    status: row.status,
    isOnboardingCompleted: row.isOnboardingCompleted,
    lastLoginAt: row.lastLoginAt ?? null,
    bannedAt: null,
    bannedReason: row.bannedReason,
    createdAt: row.createdAt,
    jarCount: row.jarCount,
    transactionCount: row.transactionCount,
  };
}

function mapDetailApiPayload(raw: AdminUserDetailApiPayload): AdminUserDetail {
  const username = String(raw.username ?? raw.userName ?? "").trim();
  const firstName = raw.firstName?.trim() ?? "";
  const lastName = raw.lastName?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || username;
  const ob = raw.onboardingSummary;
  const onboarding: AdminUserOnboardingSummary | null =
    ob != null || raw.isOnboardingCompleted
      ? {
          monthlyIncome: ob?.monthlyIncome ?? null,
          occupationType: null,
          ageRange: null,
          budgetMethodPreference: ob?.budgetMethod ?? null,
          recommendedMethod: null,
          financialGoalTypes: [],
          spendingChallenges: [],
          isCompleted: raw.isOnboardingCompleted,
        }
      : null;
  const stats: AdminUserStats = {
    jarsCount: raw.jarCount ?? 0,
    transactionsCount: raw.transactionCount ?? 0,
    totalBalance: raw.totalBalance ?? 0,
    goalCount: raw.goalCount ?? 0,
  };
  return {
    id: raw.id,
    username,
    email: raw.email,
    fullName,
    phoneNumber: raw.phone ?? null,
    avatarUrl: raw.avatarUrl ?? null,
    status: raw.status,
    isOnboardingCompleted: raw.isOnboardingCompleted,
    lastLoginAt: raw.lastLoginAt ?? null,
    bannedAt: null,
    bannedReason: raw.statusReason ?? null,
    createdAt: raw.createdAt ?? null,
    preferredCurrency: raw.preferredCurrency ?? "VND",
    bannedByAdminId: null,
    onboarding,
    stats,
  };
}

async function fetchAdminUsersListJson(queryString: string): Promise<unknown> {
  return apiBare.get<unknown>(`/api/v1/admin/users?${queryString}`);
}

function unwrapAdminUserDetailPayload(raw: unknown): AdminUserDetailApiPayload {
  if (raw != null && typeof raw === "object" && "id" in raw && "email" in raw) {
    return raw as AdminUserDetailApiPayload;
  }
  if (raw != null && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data;
    if (inner != null && typeof inner === "object" && "id" in inner) {
      return inner as AdminUserDetailApiPayload;
    }
  }
  throw new Error("INVALID_ADMIN_USER_DETAIL");
}

const ADMIN_USER_STRATEGY = {
  list: "real" as RequestMode,
  detail: "real" as RequestMode,
  ban: "real" as RequestMode,
  unban: "real" as RequestMode,
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
  const goalCount = mockData.tables.goals.filter(
    (g) => g.user_id === userId && g.status === "Active",
  ).length;
  const totalBalance = mockData.tables.financial_accounts
    .filter((a) => a.user_id === userId && a.is_active)
    .reduce((sum, a) => sum + (a.current_balance ?? 0), 0);
  return { jarsCount, transactionsCount, totalBalance, goalCount };
};

const filterAndSort = (
  items: AdminUserItem[],
  params: AdminUsersListParams,
): AdminUserItem[] => {
  const search = params.search?.trim().toLowerCase() ?? "";
  const roleFilter = params.role ?? "all";
  const statusFilter = params.status ?? "all";
  const sortBy = params.sortBy ?? "lastLogin";
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
    if (sortBy === "username")
      return a.username.localeCompare(b.username) * dir;
    const ta = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
    const tb = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
    return (ta - tb) * dir;
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
      if (params.search?.trim()) query.set("keyword", params.search.trim());
      if (params.status && params.status !== "all") {
        query.set("status", params.status === "banned" ? "Banned" : "Active");
      }
      query.set("pageIndex", String(page));
      query.set("pageSize", String(pageSize));
      const raw = await fetchAdminUsersListJson(query.toString());
      const parsed = parseAdminUsersListResponse(raw);
      return {
        items: parsed.rows.map(mapListApiRow),
        total: parsed.total,
        page: parsed.page,
        pageSize: parsed.pageSize,
        totalPages: parsed.totalPages,
      };
    };

    const mockRequest = async (): Promise<AdminUsersListResult> => {
      await wait(200);
      const roleMap = buildRoleMap();
      const all = mockData.tables.accounts.map((a) => toListItem(a, roleMap));
      const filtered = filterAndSort(all, params);
      const paged = paginate(filtered, page, pageSize);
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      return {
        items: paged,
        total: filtered.length,
        page,
        pageSize,
        totalPages,
      };
    };

    return requestWithStrategy(
      ADMIN_USER_STRATEGY.list,
      realRequest,
      mockRequest,
    );
  },

  async getById(id: string): Promise<AdminUserDetail> {
    const realRequest = async () => {
      const raw = await apiClient.get<unknown>(`/api/v1/admin/users/${id}`);
      return mapDetailApiPayload(unwrapAdminUserDetailPayload(raw));
    };

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
    const realRequest = async () => {
      await apiClient.patch(`/api/v1/admin/users/${id}/status`, {
        status: "Banned",
        statusReason: reason,
      });
      return adminUserService.getById(id);
    };

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
    const realRequest = async () => {
      await apiClient.patch(`/api/v1/admin/users/${id}/status`, {
        status: "Active",
        statusReason: null,
      });
      return adminUserService.getById(id);
    };

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
