import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import { requestWithStrategy, type RequestMode, wait } from "@/lib/requestStrategy";
import type { DashboardGoal, DashboardSummary, DashboardTransaction } from "./types";

const DASHBOARD_STRATEGY = {
  summary: "mock" as RequestMode,
  adminSummary: "mock" as RequestMode,
} as const;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const toTransaction = (item: (typeof mockData.tables.transactions)[number]): DashboardTransaction => ({
  id: item.id,
  type: item.type,
  amount: item.amount,
  note: item.note ?? "",
  transactionDate: item.transaction_date,
});

const toGoal = (item: (typeof mockData.tables.goals)[number]): DashboardGoal => {
  const progressPercent =
    item.target_amount > 0 ? Math.min(100, Math.round((item.saved_amount / item.target_amount) * 100)) : 0;

  return {
    id: item.id,
    title: item.title,
    targetAmount: item.target_amount,
    savedAmount: item.saved_amount,
    progressPercent,
  };
};

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const realRequest = () =>
      apiClient.get<DashboardSummary>("/dashboard/summary") as unknown as Promise<DashboardSummary>;

    const mockRequest = async () => {
      await wait(250);

      const totalBalance = mockData.tables.jars.reduce((sum, jar) => sum + jar.balance, 0);
      const monthlyExpense = mockData.tables.transactions
        .filter((transaction) => transaction.type === "Expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const savingGoal = mockData.tables.goals[0];
      const goalProgress =
        savingGoal && savingGoal.target_amount > 0
          ? Math.round((savingGoal.saved_amount / savingGoal.target_amount) * 100)
          : 0;

      return {
        stats: [
          { label: "Total Balance", value: formatCurrency(totalBalance) },
          { label: "Monthly Expense", value: formatCurrency(monthlyExpense) },
          { label: "Goal Progress", value: `${goalProgress}%` },
        ],
        recentTransactions: mockData.tables.transactions.slice(0, 5).map(toTransaction),
        goals: mockData.tables.goals.map(toGoal),
      };
    };

    return requestWithStrategy(DASHBOARD_STRATEGY.summary, realRequest, mockRequest);
  },

  async getAdminSummary(): Promise<DashboardSummary> {
    const realRequest = () =>
      apiClient.get<DashboardSummary>("/admin/dashboard/summary") as unknown as Promise<DashboardSummary>;

    const mockRequest = async () => {
      await wait(200);

      const activeUsers = mockData.tables.accounts.filter((account) => account.status === "Active").length;
      const totalTransactions = mockData.tables.transactions.length;
      const unreadNotifications = mockData.tables.notifications.filter((notification) => !notification.is_read).length;

      return {
        stats: [
          { label: "Active Users", value: `${activeUsers}` },
          { label: "Transactions", value: `${totalTransactions}` },
          { label: "Unread Alerts", value: `${unreadNotifications}` },
        ],
        recentTransactions: mockData.tables.transactions.slice(0, 5).map(toTransaction),
        goals: mockData.tables.goals.map(toGoal),
      };
    };

    return requestWithStrategy(DASHBOARD_STRATEGY.adminSummary, realRequest, mockRequest);
  },
};
