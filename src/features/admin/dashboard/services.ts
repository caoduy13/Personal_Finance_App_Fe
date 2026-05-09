import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants/apiEndpoint";
import type {
  DashboardRecentUser,
  DashboardSummary,
  DashboardTransaction,
  DashboardTrendPoint,
} from "./types";

const DASHBOARD_STRATEGY = {
  adminSummary: "real" as RequestMode,
} as const;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const toTransaction = (
  item: (typeof mockData.tables.transactions)[number],
): DashboardTransaction => ({
  id: item.id,
  type: item.type,
  amount: item.amount,
  note: item.note ?? "",
  transactionDate: item.transaction_date,
});

const toRecentUser = (
  item: (typeof mockData.tables.accounts)[number],
): DashboardRecentUser => ({
  id: item.id,
  fullName: item.full_name,
  email: item.email,
  status: item.status,
  createdAt: item.created_at,
});

function mapBeRecentUser(raw: unknown): DashboardRecentUser | null {
  if (raw == null || typeof raw !== "object") return null;
  const x = raw as Record<string, unknown>;
  const id = String(x.id ?? "");
  if (!id) return null;
  const first = String(x.firstName ?? "").trim();
  const last = String(x.lastName ?? "").trim();
  const uname = String(x.username ?? x.userName ?? "").trim();
  const fullName = `${first} ${last}`.trim() || uname || "—";
  const email = String(x.email ?? "");
  const status = String(x.status ?? "Active");
  const createdAt = x.lastLoginAt != null ? String(x.lastLoginAt) : new Date().toISOString();
  return { id, fullName, email, status, createdAt };
}

function mapBeRecentTx(raw: unknown): DashboardTransaction | null {
  if (raw == null || typeof raw !== "object") return null;
  const x = raw as Record<string, unknown>;
  const id = String(x.id ?? "");
  if (!id) return null;
  const type = x.type === "Income" || x.type === "Expense" ? x.type : "Expense";
  const amount = Number(x.transactionsAmount ?? x.amount ?? 0);
  const note = x.note != null ? String(x.note) : "";
  const transactionDate = String(
    x.transactionDate ?? x.date ?? new Date().toISOString(),
  );
  return { id, type, amount: Math.abs(amount), note, transactionDate };
}

/** Gắn response `GET /api/v1/admin/dashboard` → layout FE hiện tại. */
function adaptBeAdminDashboard(raw: unknown): DashboardSummary {
  if (raw == null || typeof raw !== "object") {
    throw new Error("INVALID_ADMIN_DASHBOARD");
  }
  const r = raw as Record<string, unknown>;
  const summary = (r.summary ?? {}) as Record<string, unknown>;

  const totalUsers = Number(summary.totalUsers ?? 0);
  const newUsers = Number(summary.newUsersThisMonth ?? 0);
  const active30 = Number(summary.activeUsersLast30Days ?? 0);
  const banned = Number(summary.bannedUsers ?? 0);
  const txMonth = Number(summary.transactionsThisMonth ?? 0);
  const totalTx = Number(summary.totalTransactions ?? 0);
  const totalJars = Number(summary.totalJars ?? 0);
  const activeGoals = Number(summary.activeGoals ?? 0);
  const pendingImports = Number(summary.pendingImportJobs ?? 0);

  const recentUsersRaw = Array.isArray(r.recentUsers) ? r.recentUsers : [];
  const recentUsers = recentUsersRaw
    .map(mapBeRecentUser)
    .filter((u): u is DashboardRecentUser => u != null);

  const recentTxRaw = Array.isArray(r.recentTransactions) ? r.recentTransactions : [];
  const recentTransactions = recentTxRaw
    .map(mapBeRecentTx)
    .filter((t): t is DashboardTransaction => t != null);

  const txAvg = Math.max(0, Math.round(txMonth / 7));
  const transactionVolumeTrend: DashboardTrendPoint[] = [
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "CN",
  ].map((label, i) => ({
    label,
    amount: Math.round(txAvg * (0.85 + (i % 4) * 0.05)),
    count: Math.max(0, Math.round(txAvg / 50_000) + i),
  }));

  const categoryAgg = new Map<string, number>();
  for (const row of recentTxRaw) {
    if (row == null || typeof row !== "object") continue;
    const cat = (row as Record<string, unknown>).category as
      | Record<string, unknown>
      | undefined
      | null;
    const name = cat && typeof cat.name === "string" ? cat.name : "Khác";
    const amt = Number((row as Record<string, unknown>).transactionsAmount ?? 0);
    categoryAgg.set(name, (categoryAgg.get(name) ?? 0) + Math.abs(amt));
  }
  const topSpendingCategories = [...categoryAgg.entries()].map(([label, value]) => ({
    label,
    value,
  }));

  return {
    stats: [
      {
        label: "Tổng người dùng",
        value: `${totalUsers}`,
        hint: `+${newUsers} người mới tháng này`,
      },
      {
        label: "Hoạt động (30 ngày)",
        value: `${active30}`,
        hint: `${banned} tài khoản bị khóa`,
      },
      {
        label: "Giao dịch",
        value: `${txMonth}`,
        hint: `${totalTx} giao dịch tích luỹ • jars: ${totalJars} • goals: ${activeGoals}`,
      },
      {
        label: "Import / hệ thống",
        value: `${pendingImports}`,
        hint: formatCurrency(0),
      },
    ],
    transactionVolumeTrend,
    recentTransactions,
    recentUsers,
    topSpendingCategories,
    retentionTrend: [],
  };
}

export const adminDashboardService = {
  async getAdminSummary(): Promise<DashboardSummary> {
    const realRequest = async () => {
      const raw = await apiClient.get<unknown>(API_ENDPOINT.ADMIN.DASHBOARD);
      return adaptBeAdminDashboard(raw);
    };

    const mockRequest = async () => {
      await wait(200);

      const totalUsers = mockData.tables.accounts.length;
      const activeUsers = mockData.tables.accounts.filter(
        (account) => account.status === "Active",
      ).length;
      const bannedUsers = mockData.tables.accounts.filter(
        (account) => String(account.status).toLowerCase() === "banned",
      ).length;
      const totalTransactions = 200;
      const totalTransactionAmount = 100_000_000;

      const previousUsers = Math.max(1, totalUsers - 1);
      const userGrowthPercent = Math.round(
        ((totalUsers - previousUsers) / previousUsers) * 100,
      );

      const dau = Math.max(1, Math.round(activeUsers * 0.58));
      const mau = Math.max(dau, activeUsers);
      const engagementPercent = Math.round((dau / mau) * 100);

      const syncErrorRate = 0.02;
      const healthStatus =
        syncErrorRate <= 0.1
          ? "Tốt"
          : syncErrorRate <= 1
            ? "Cảnh báo"
            : "Nghiêm trọng";

      return {
        stats: [
          {
            label: "Tổng người dùng",
            value: `${totalUsers}`,
            hint: `+${userGrowthPercent}% so với kỳ trước`,
          },
          {
            label: "Tương tác (DAU/MAU)",
            value: `${dau} / ${mau}`,
            hint: `${engagementPercent}% mức gắn kết`,
          },
          {
            label: "Tổng giá trị giao dịch",
            value: formatCurrency(totalTransactionAmount),
            hint: `${totalTransactions} giao dịch trong kỳ`,
          },
          {
            label: "Sức khỏe hệ thống",
            value: `${syncErrorRate}%`,
            hint: `${healthStatus} • ${bannedUsers} tài khoản bị khóa`,
          },
        ],
        transactionVolumeTrend: [
          { label: "T2", amount: 14_000_000, count: 28 },
          { label: "T3", amount: 12_000_000, count: 24 },
          { label: "T4", amount: 16_000_000, count: 32 },
          { label: "T5", amount: 13_000_000, count: 26 },
          { label: "T6", amount: 17_000_000, count: 34 },
          { label: "T7", amount: 12_000_000, count: 24 },
          { label: "CN", amount: 16_000_000, count: 32 },
        ],
        recentTransactions: mockData.tables.transactions
          .slice(0, 5)
          .map(toTransaction),
        recentUsers: [...mockData.tables.accounts]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 5)
          .map(toRecentUser),
        topSpendingCategories: [
          { label: "Ăn uống", value: 32_000_000 },
          { label: "Mua sắm", value: 24_000_000 },
          { label: "Di chuyển", value: 18_000_000 },
          { label: "Giải trí", value: 14_000_000 },
          { label: "Khác", value: 12_000_000 },
        ],
        retentionTrend: [
          {
            periodLabel: "D0",
            cohortA: 100,
            cohortB: 100,
            cohortC: 100,
            cohortD: 100,
          },
          {
            periodLabel: "D7",
            cohortA: 76,
            cohortB: 72,
            cohortC: 68,
            cohortD: 64,
          },
          {
            periodLabel: "D14",
            cohortA: 66,
            cohortB: 61,
            cohortC: 57,
            cohortD: 53,
          },
          {
            periodLabel: "D21",
            cohortA: 59,
            cohortB: 55,
            cohortC: 51,
            cohortD: 47,
          },
          {
            periodLabel: "D30",
            cohortA: 52,
            cohortB: 48,
            cohortC: 44,
            cohortD: 40,
          },
        ],
      };
    };

    return requestWithStrategy(
      DASHBOARD_STRATEGY.adminSummary,
      realRequest,
      mockRequest,
    );
  },
};
