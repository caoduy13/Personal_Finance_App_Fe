import { useAuthStore } from "@/features/auth/store";
import { BUDGET_METHOD } from "@/constants/onboarding";
import type { BudgetMethodId } from "@/constants/onboarding";
import { apiClient } from "@/lib/axios";
import { env } from "@/lib/env";
import { mockData } from "@/lib/mockData";
import {
  requestWithStrategy,
  type RequestMode,
  wait,
} from "@/lib/requestStrategy";
import { API_ENDPOINT } from "@/shared/constants";
import type {
  OnboardingCompleteResult,
  OnboardingFeForm,
  SuggestionRow,
} from "./types";

const onboardingRequestMode = (): RequestMode =>
  env.USE_REAL_AUTH ? "real" : "mock";

const sixJarsSuggestions = [
  { name: "Sinh hoạt", percentage: 55, icon: "🏠" },
  { name: "Giáo dục", percentage: 10, icon: "📚" },
  { name: "Tiết kiệm", percentage: 10, icon: "💰" },
  { name: "Giải trí", percentage: 10, icon: "🎮" },
  { name: "Đầu tư", percentage: 10, icon: "📈" },
  { name: "Từ thiện", percentage: 5, icon: "❤️" },
];

const rule503020Suggestions = [
  { name: "Nhu cầu thiết yếu", percentage: 50, icon: "🏠" },
  { name: "Mong muốn", percentage: 30, icon: "🎯" },
  { name: "Tiết kiệm", percentage: 20, icon: "💰" },
];

export function mapFeFormToSwaggerBody(form: OnboardingFeForm): {
  monthlyIncome: number;
  occupationType: string | null;
  financialGoalTypes: string[];
  budgetMethodPreference: string | null;
  ageRange: string | null;
  spendingChallenges: string[];
} {
  const income = Number(form?.monthlyIncome);
  return {
    monthlyIncome: Number.isFinite(income) ? Math.round(income) : 0,
    occupationType: form?.occupation?.trim() ? form.occupation : null,
    financialGoalTypes: Array.isArray(form?.financialGoals)
      ? [...form.financialGoals]
      : [],
    budgetMethodPreference: form?.budgetingMethod ?? null,
    ageRange: form?.ageRange?.trim() ? form.ageRange : null,
    spendingChallenges: Array.isArray(form?.spendingChallenges)
      ? [...form.spendingChallenges]
      : [],
  };
}

export function enrichJarsWithMonthlyAmount(
  jars: Array<{ name?: string; percentage?: number; icon?: string }>,
  monthlyIncomeVnd: number,
): SuggestionRow[] {
  const income = Number(monthlyIncomeVnd);
  const base = Number.isFinite(income) ? income : 0;
  return (jars ?? []).map((j) => ({
    name: String(j.name ?? ""),
    percentage: Number(j.percentage) || 0,
    icon: String(j.icon ?? ""),
    monthlyAmount: Math.round((base * (Number(j.percentage) || 0)) / 100),
  }));
}

type JarSuggestion = { name?: string; percentage?: number; icon?: string };

export function normalizeSuggestionsResponse(res: unknown): JarSuggestion[] {
  if (res == null) return [];
  if (Array.isArray(res)) return res;
  if (typeof res !== "object") return [];
  const r = res as Record<string, unknown>;
  if (Array.isArray(r.jars)) return r.jars as JarSuggestion[];
  const data = r.data;
  if (data != null && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.jars)) return d.jars as JarSuggestion[];
  }
  if (Array.isArray(data)) return data as JarSuggestion[];
  return [];
}

function normalizeOnboardingCompleteResponse(
  res: unknown,
): OnboardingCompleteResult {
  if (res == null) return { success: false, user: null };
  if (typeof res !== "object" || Array.isArray(res))
    return { success: false, user: null };
  const r = res as Record<string, unknown>;
  if (r.user && typeof r.user === "object") {
    return { success: r.success !== false, user: r.user as Record<string, unknown> };
  }
  const data = r.data;
  if (
    data &&
    typeof data === "object" &&
    (data as Record<string, unknown>).user &&
    typeof (data as Record<string, unknown>).user === "object"
  ) {
    return {
      success: true,
      user: (data as Record<string, unknown>).user as Record<string, unknown>,
    };
  }
  if ("is_onboarding_completed" in r || "id" in r) {
    return { success: true, user: r as Record<string, unknown> };
  }
  return {
    success: Boolean(r.success),
    user: (r.user as Record<string, unknown> | null) ?? null,
  };
}

function applyMockOnboardingComplete(form: OnboardingFeForm): void {
  const u = useAuthStore.getState().user;
  if (!u?.id) return;

  const nowIso = new Date().toISOString();
  const acc =
    mockData.tables.accounts.find((a) => a.id === u.id) ??
    mockData.tables.accounts.find((a) => a.email === u.email);

  if (acc) {
    acc.is_onboarding_completed = true;
    acc.updated_at = nowIso;
  }

  const existing = mockData.tables.onboarding_profiles.find(
    (p) => p.user_id === u.id,
  );
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
    mockData.tables.onboarding_profiles.push({
      id: crypto.randomUUID(),
      user_id: u.id,
      ...shared,
      created_at: nowIso,
    });
  }
}

export const onboardingService = {
  async complete(feFormData: OnboardingFeForm): Promise<OnboardingCompleteResult> {
    const body = mapFeFormToSwaggerBody(feFormData);

    const realRequest = async () => {
      const raw = await apiClient.post(API_ENDPOINT.ONBOARDING, body);
      const normalized = normalizeOnboardingCompleteResponse(raw);
      if (normalized.success) return normalized;
      return { success: true, user: null };
    };

    const mockRequest = async () => {
      await wait(280);
      applyMockOnboardingComplete(feFormData);
      return normalizeOnboardingCompleteResponse({
        success: true,
        user: {
          is_onboarding_completed: true,
          budgeting_method: feFormData.budgetingMethod,
          onboarding_survey: body,
        },
      });
    };

    return requestWithStrategy(
      onboardingRequestMode(),
      realRequest,
      mockRequest,
    );
  },

  /**
   * Gợi ý hũ theo phương pháp — luôn dùng template local (BE chưa có endpoint ổn định).
   */
  async getSuggestions(method: BudgetMethodId): Promise<unknown> {
    await wait(0);
    if (method === BUDGET_METHOD.SIX_JARS) return { jars: sixJarsSuggestions };
    if (method === BUDGET_METHOD.RULE_503020)
      return { jars: rule503020Suggestions };
    return { jars: [] };
  },

  async getSuggestionsForIncome(
    method: BudgetMethodId,
    monthlyIncomeVnd: number,
  ): Promise<SuggestionRow[]> {
    const raw = await onboardingService.getSuggestions(method);
    const jars = normalizeSuggestionsResponse(raw);
    return enrichJarsWithMonthlyAmount(jars, monthlyIncomeVnd);
  },
};
