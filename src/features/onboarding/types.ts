import type { BudgetMethodId } from "@/constants/onboarding";

export interface OnboardingFeForm {
  monthlyIncome: number;
  occupation: string;
  ageRange: string;
  financialGoals: string[];
  spendingChallenges: string[];
  budgetingMethod: BudgetMethodId | null;
}

export interface SuggestionRow {
  name: string;
  percentage: number;
  icon: string;
  monthlyAmount: number;
}

export interface OnboardingCompleteResult {
  success: boolean;
  user: Record<string, unknown> | null;
}
