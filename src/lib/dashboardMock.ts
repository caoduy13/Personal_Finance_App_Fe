import type { DashboardResponse } from "@/features/dashboard/types";

export const dashboardMock: DashboardResponse = {
  balanceSummary: {
    totalBalance: 28_500_750,
    allocatedBalance: 24_000_000,
    unallocatedBalance: 4_500_750,
    totalIncome: 15_000_000,
    totalExpense: 3_500_600,
    netChange: 11_499_400,
  },
  financialAccounts: [
    { id: "fa-1", name: "Tiền mặt", currentBalance: 4_500_750, isDefault: true },
    { id: "fa-2", name: "Vietcombank", currentBalance: 24_000_000, isDefault: false },
  ],
  jarSummary: [
    {
      jarId: "j-1",
      jarName: "Necessities",
      balance: 12_000_000,
      spent: 3_500_000,
      spentPercentage: 29.16,
    },
    {
      jarId: "j-2",
      jarName: "Education",
      balance: 6_000_000,
      spent: 0,
      spentPercentage: 0,
    },
    {
      jarId: "j-3",
      jarName: "Long-term Saving",
      balance: 6_000_000,
      spent: 0,
      spentPercentage: 0,
    },
    {
      jarId: "j-4",
      jarName: "Play",
      balance: 3_000_000,
      spent: 600,
      spentPercentage: 0.02,
    },
  ],
  categoryBreakdown: [
    { categoryId: "c-1", categoryName: "Mua sắm", totalAmount: 1_820_000, percentage: 52 },
    { categoryId: "c-2", categoryName: "Ăn uống", totalAmount: 735_000, percentage: 21 },
    { categoryId: "c-3", categoryName: "Di chuyển", totalAmount: 945_000, percentage: 27 },
  ],
  recentTransactions: [
    {
      id: "t-1",
      type: "Expense",
      transactionsAmount: 75_000,
      note: "Highlands Coffee",
      date: "2026-05-07T10:00:00+07:00",
    },
    {
      id: "t-2",
      type: "Expense",
      transactionsAmount: 150_000,
      note: "Grab",
      date: "2026-05-06T19:30:00+07:00",
    },
    {
      id: "t-3",
      type: "Income",
      transactionsAmount: 15_000_000,
      note: "Lương tháng 5",
      date: "2026-05-05T09:00:00+07:00",
    },
    {
      id: "t-4",
      type: "Expense",
      transactionsAmount: 350_000,
      note: "Shopee",
      date: "2026-05-04T15:00:00+07:00",
    },
    {
      id: "t-5",
      type: "Expense",
      transactionsAmount: 45_000,
      note: "Circle K",
      date: "2026-05-03T07:00:00+07:00",
    },
  ],
  goalProgress: [
    {
      goalId: "g-1",
      title: "Du lịch Đà Lạt",
      progressPercentage: 40,
      daysRemaining: 217,
    },
    {
      goalId: "g-2",
      title: "MacBook Pro",
      progressPercentage: 25,
      daysRemaining: 52,
    },
    {
      goalId: "g-3",
      title: "Quỹ khẩn cấp",
      progressPercentage: 60,
      daysRemaining: 235,
    },
  ],
};
