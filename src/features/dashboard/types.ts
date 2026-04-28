export interface DashboardStat {
  label: string;
  value: string;
  hint?: string;
}

export interface DashboardTransaction {
  id: string;
  type: "Income" | "Expense";
  amount: number;
  note: string;
  transactionDate: string;
}

export interface DashboardGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  progressPercent: number;
}

export interface DashboardSummary {
  stats: DashboardStat[];
  recentTransactions: DashboardTransaction[];
  goals: DashboardGoal[];
}
