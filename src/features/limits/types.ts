export interface SpendingLimit {
  id: string;
  targetType: "Jar" | "Category";
  targetId: string;
  targetName: string;
  limitAmount: number;
  period: string;
  alertAtPercentage: number;
  currentSpent: number;
  currentPercentage: number;
  status: string;
}

export interface CreateLimitPayload {
  targetType: "Jar" | "Category";
  targetId: string;
  limitAmount: number;
  period: "Daily" | "Monthly";
  alertAtPercentage: number;
}

export interface UpdateLimitPayload {
  limitAmount?: number;
  alertAtPercentage?: number;
}
