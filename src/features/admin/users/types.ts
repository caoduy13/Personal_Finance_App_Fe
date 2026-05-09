export type AdminUserStatus = "Active" | "Banned";
export type AdminUserRoleCode = "ADMIN" | "USER";

export interface AdminUserItem {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  status: AdminUserStatus;
  /** Chỉ có khi dữ liệu mock; API admin list hiện không trả role. */
  roleCode?: AdminUserRoleCode;
  isOnboardingCompleted: boolean;
  lastLoginAt: string | null;
  bannedAt: string | null;
  bannedReason: string | null;
  /** API list mới không có; mock vẫn có. */
  createdAt: string | null;
  jarCount?: number;
  transactionCount?: number;
}

/** Khớp query contract: `sortBy=lastLogin|username` */
export type AdminUserSortField = "lastLogin" | "username";
export type AdminUserSortDir = "asc" | "desc";

export interface AdminUsersListParams {
  search?: string;
  role?: "all" | "user" | "admin";
  status?: "all" | "active" | "banned";
  sortBy?: AdminUserSortField;
  sortDir?: AdminUserSortDir;
  page?: number;
  pageSize?: number;
}

export interface AdminUsersListResult {
  items: AdminUserItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminUserOnboardingSummary {
  monthlyIncome: number | null;
  occupationType: string | null;
  ageRange: string | null;
  budgetMethodPreference: string | null;
  recommendedMethod: string | null;
  financialGoalTypes: string[];
  spendingChallenges: string[];
  isCompleted: boolean;
}

export interface AdminUserStats {
  jarsCount: number;
  transactionsCount: number;
  totalBalance: number;
  goalCount: number;
}

export interface AdminUserDetail extends AdminUserItem {
  preferredCurrency: string;
  bannedByAdminId: string | null;
  onboarding: AdminUserOnboardingSummary | null;
  stats: AdminUserStats;
}

/** Payload GET detail — API V2 (camelCase) + bản mở rộng có thống kê. */
export interface AdminUserDetailApiPayload {
  id: string;
  username?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  preferredCurrency?: string;
  status: AdminUserStatus;
  statusReason?: string | null;
  isOnboardingCompleted: boolean;
  createdAt?: string | null;
  onboardingSummary?: {
    monthlyIncome: number | null;
    budgetMethod: string | null;
  } | null;
  jarCount?: number;
  totalBalance?: number;
  transactionCount?: number;
  goalCount?: number;
  lastLoginAt?: string | null;
}
