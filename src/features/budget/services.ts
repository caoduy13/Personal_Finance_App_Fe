import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import type { BudgetLimit } from "./types";

const BUDGET_STRATEGY = {
  list: "mock" as RequestMode,
} as const;

export const budgetService = {
  async list(): Promise<BudgetLimit[]> {
    const realRequest = () => apiClient.get<BudgetLimit[]>("/budgets/limits") as unknown as Promise<BudgetLimit[]>;

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
