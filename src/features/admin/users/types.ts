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
  roleCode: AdminUserRoleCode;
  isOnboardingCompleted: boolean;
  lastLoginAt: string | null;
  bannedAt: string | null;
  bannedReason: string | null;
  createdAt: string;
}

export type AdminUserSortField = "fullName" | "email" | "createdAt";
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
}

export interface AdminUserDetail extends AdminUserItem {
  preferredCurrency: string;
  bannedByAdminId: string | null;
  onboarding: AdminUserOnboardingSummary | null;
  stats: AdminUserStats;
}
