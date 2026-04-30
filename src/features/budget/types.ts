export interface BudgetLimit {
  id: string;
  jarId: string | null;
  categoryId: string | null;
  limitAmount: number;
  period: "Daily" | "Monthly";
  alertAtPercentage: number;
  isActive: boolean;
}
