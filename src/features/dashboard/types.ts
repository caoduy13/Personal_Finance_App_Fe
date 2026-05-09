export interface DashboardResponse {
  balanceSummary: {
    totalBalance: number;
    allocatedBalance: number;
    unallocatedBalance: number;
    totalIncome: number;
    totalExpense: number;
    netChange: number;
  };
  financialAccounts: Array<{
    id: string;
    name: string;
    currentBalance: number;
    isDefault: boolean;
  }>;
  jarSummary: Array<{
    jarId: string;
    jarName: string;
    balance: number;
    spent: number;
    spentPercentage: number;
  }>;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: "Income" | "Expense";
    transactionsAmount: number;
    note: string | null;
    date: string;
  }>;
  goalProgress: Array<{
    goalId: string;
    title: string;
    progressPercentage: number;
    daysRemaining: number;
  }>;
}
