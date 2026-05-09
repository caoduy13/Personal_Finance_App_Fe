import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import type { BudgetLimit } from "./types";

const BUDGET_STRATEGY = {
  list: "real" as RequestMode,
} as const;

function parseLimitsPayload(raw: unknown): BudgetLimit[] {
  if (raw == null || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const arr = Array.isArray(o.data) ? o.data : Array.isArray(raw) ? (raw as unknown[]) : [];
  return arr
    .map((row): BudgetLimit | null => {
      if (row == null || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const id = String(r.id ?? "");
      if (!id) return null;
      const targetType = String(r.targetType ?? "");
      const targetId = String(r.targetId ?? "");
      const period = r.period === "Daily" || r.period === "Monthly" ? r.period : "Monthly";
      const status = String(r.status ?? "Active");
      return {
        id,
        jarId: targetType === "Jar" ? targetId : null,
        categoryId: targetType === "Category" ? targetId : null,
        limitAmount: Number(r.limitAmount ?? 0),
        period,
        alertAtPercentage: Number(r.alertAtPercentage ?? 0),
        isActive: status.toLowerCase() !== "inactive",
      };
    })
    .filter((x): x is BudgetLimit => x != null);
}

export const budgetService = {
  async list(): Promise<BudgetLimit[]> {
    const realRequest = async () =>
      parseLimitsPayload(await apiClient.get<unknown>("/api/v1/limits"));

    const mockRequest = async () => {
      await wait(150);
      return mockData.tables.spending_limits.map((item) => ({
        id: item.id,
        jarId: item.jar_id,
        categoryId: item.category_id,
        limitAmount: item.limit_amount,
        period: item.period,
        alertAtPercentage: item.alert_at_percentage,
        isActive: item.is_active,
      }));
    };

    return requestWithStrategy(BUDGET_STRATEGY.list, realRequest, mockRequest);
  },
};
