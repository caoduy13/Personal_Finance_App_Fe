/**
 * Ambient types for the JS-implemented onboarding service module.
 * Keeps TS happy without touching the runtime .js file.
 */
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

export const onboardingService: {
  complete(feFormData: OnboardingFeForm): Promise<OnboardingCompleteResult>;
  getSuggestions(method: BudgetMethodId): Promise<unknown>;
  getSuggestionsForIncome(
    method: BudgetMethodId,
    monthlyIncomeVnd: number,
  ): Promise<SuggestionRow[]>;
};

export function mapFeFormToOnboardingRequest(feForm: OnboardingFeForm): Record<string, unknown>;
export function enrichJarsWithMonthlyAmount(
  jars: Array<{ name?: string; percentage?: number; icon?: string }>,
  monthlyIncomeVnd: number,
): SuggestionRow[];
export function normalizeSuggestionsResponse(res: unknown): { jars: unknown[] };
export function normalizeOnboardingCompleteResponse(res: unknown): OnboardingCompleteResult;
