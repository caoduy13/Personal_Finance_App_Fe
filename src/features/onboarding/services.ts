import { useAuthStore } from "@/features/auth/store";
import { BUDGET_METHOD } from "@/constants/onboarding";
import type { BudgetMethodId } from "@/constants/onboarding";
import { apiClient } from "@/lib/axios";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants";
import type { OnboardingForm } from "./schema";
import type { SuggestionRow } from "./types";

const ONBOARDING_MODE = { complete: "real" as RequestMode };

const sixJarsTemplate = [
  { name: "Sinh hoạt", percentage: 55, icon: "🏠" },
  { name: "Giáo dục", percentage: 10, icon: "📚" },
  { name: "Tiết kiệm", percentage: 10, icon: "💰" },
  { name: "Giải trí", percentage: 10, icon: "🎮" },
  { name: "Đầu tư", percentage: 10, icon: "📈" },
  { name: "Từ thiện", percentage: 5, icon: "❤️" },
] as const;

const rule503020Template = [
  { name: "Nhu cầu thiết yếu", percentage: 50, icon: "🏠" },
  { name: "Mong muốn", percentage: 30, icon: "🎯" },
  { name: "Tiết kiệm", percentage: 20, icon: "💰" },
] as const;

function toRequestBody(form: OnboardingForm) {
  const income = Number(form.monthlyIncome);
  return {
    monthlyIncome: Number.isFinite(income) ? Math.round(income) : 0,
    occupationType: form.occupation?.trim() ? form.occupation : null,
    financialGoalTypes: [...form.financialGoals],
    budgetMethodPreference: form.budgetingMethod ?? null,
    ageRange: form.ageRange?.trim() ? form.ageRange : null,
    spendingChallenges: [...form.spendingChallenges],
  };
}

/** Gợi ý hũ — template local (không gọi BE). */
export function getSuggestionRows(
  method: BudgetMethodId | null,
  monthlyIncomeVnd: number,
): SuggestionRow[] {
  if (!method || method === BUDGET_METHOD.CUSTOM) return [];

  const jars =
    method === BUDGET_METHOD.SIX_JARS
      ? sixJarsTemplate
      : method === BUDGET_METHOD.RULE_503020
        ? rule503020Template
        : [];

  const base = Number.isFinite(monthlyIncomeVnd) ? monthlyIncomeVnd : 0;
  return jars.map((j) => ({
    name: j.name,
    percentage: j.percentage,
    icon: j.icon,
    monthlyAmount: Math.round((base * j.percentage) / 100),
  }));
}

function patchMockTables(form: OnboardingForm): void {
  const u = useAuthStore.getState().user;
  if (!u?.id) return;

  const nowIso = new Date().toISOString();
  const accounts = mockData.tables.accounts as unknown as Array<{
    id: string;
    email: string;
    is_onboarding_completed?: boolean;
    updated_at: string;
  }>;
  const acc =
    accounts.find((a) => a.id === u.id) ??
    accounts.find((a) => a.email === u.email);

  if (acc) {
    acc.is_onboarding_completed = true;
    acc.updated_at = nowIso;
  }

  const profiles = mockData.tables.onboarding_profiles as unknown as Array<
    Record<string, unknown> & { user_id?: string }
  >;
  const existing = profiles.find((p) => p.user_id === u.id);
  const shared = {
    monthly_income: form.monthlyIncome,
    occupation_type: form.occupation || "other",
    financial_goal_types: form.financialGoals.join(","),
    budget_method_preference: form.budgetingMethod ?? BUDGET_METHOD.CUSTOM,
    age_range: form.ageRange || "",
    spending_challenges: form.spendingChallenges.join(","),
    recommended_method: form.budgetingMethod ?? BUDGET_METHOD.CUSTOM,
    completed_at: nowIso,
    updated_at: nowIso,
  };

  if (existing) {
    Object.assign(existing, shared);
  } else {
    profiles.push({
      id: crypto.randomUUID(),
      user_id: u.id,
      ...shared,
      created_at: nowIso,
    });
  }
}

export const onboardingService = {
  /**
   * Một lần duy nhất ở cuối wizard (bước 4) — `useOnboardingForm.submit` / `useMutation`.
   * Các bước 1–3 không gọi BE (chỉ validate + gợi ý local).
   */
  async complete(form: OnboardingForm): Promise<void> {
    const body = toRequestBody(form);

    const realRequest = async () => {
      await apiClient.post(API_ENDPOINT.ONBOARDING, body);
    };

    const mockRequest = async () => {
      await wait(280);
      patchMockTables(form);
    };

    await requestWithStrategy(
      ONBOARDING_MODE.complete,
      realRequest,
      mockRequest,
    );
  },
};
