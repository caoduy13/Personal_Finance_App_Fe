import { apiClient } from "@/lib/axios";
import { API_ENDPOINT } from "@/shared/constants";
import type { UserDashboardData } from "./types";

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function strId(v: unknown): string {
  return String(v ?? "");
}

function normalizeDashboard(raw: unknown): UserDashboardData {
  const r = raw as Record<string, unknown>;
  const bs = r.balanceSummary as Record<string, unknown> | undefined;

  const balanceSummary = {
    totalBalance: num(bs?.totalBalance),
    allocatedBalance: num(bs?.allocatedBalance),
    unallocatedBalance: num(bs?.unallocatedBalance),
    totalIncome: num(bs?.totalIncome),
    totalExpense: num(bs?.totalExpense),
    netChange: num(bs?.netChange),
  };

  const financialAccounts = (
    (r.financialAccounts as unknown[]) ?? []
  ).map((x) => {
    const a = x as Record<string, unknown>;
    return {
      id: strId(a.id),
      name: String(a.name ?? ""),
      currentBalance: num(a.currentBalance),
      isDefault: Boolean(a.isDefault),
    };
  });

  const jarSummary = ((r.jarSummary as unknown[]) ?? []).map((x) => {
    const j = x as Record<string, unknown>;
    return {
      jarId: strId(j.jarId),
      jarName: String(j.jarName ?? ""),
      balance: num(j.balance),
      spent: num(j.spent),
      spentPercentage: num(j.spentPercentage),
    };
  });

  const categoryBreakdown = (
    (r.categoryBreakdown as unknown[]) ?? []
  ).map((x) => {
    const c = x as Record<string, unknown>;
    return {
      categoryId: strId(c.categoryId),
      categoryName: String(c.categoryName ?? ""),
      totalAmount: num(c.totalAmount),
      percentage: num(c.percentage),
    };
  });

  const recentTransactions = (
    (r.recentTransactions as unknown[]) ?? []
  ).map((x) => {
    const t = x as Record<string, unknown>;
    const d = t.date;
    return {
      id: strId(t.id),
      type: String(t.type ?? ""),
      transactionsAmount: num(t.transactionsAmount),
      note: t.note != null ? String(t.note) : null,
      date:
        typeof d === "string"
          ? d
          : d instanceof Date
            ? d.toISOString()
            : String(d ?? ""),
    };
  });

  const goalProgress = ((r.goalProgress as unknown[]) ?? []).map((x) => {
    const g = x as Record<string, unknown>;
    return {
      goalId: strId(g.goalId),
      title: String(g.title ?? ""),
      progressPercentage: num(g.progressPercentage),
      daysRemaining: num(g.daysRemaining),
    };
  });

  return {
    balanceSummary,
    financialAccounts,
    jarSummary,
    categoryBreakdown,
    recentTransactions,
    goalProgress,
  };
}

export const userDashboardService = {
  async getDashboard(): Promise<UserDashboardData> {
    const raw = await apiClient.get(API_ENDPOINT.USER_DASHBOARD);
    return normalizeDashboard(raw);
  },
};
