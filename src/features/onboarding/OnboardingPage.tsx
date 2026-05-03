/**
 * Multi-step onboarding survey: income, goals, budgeting method, and suggested jars.
 * Ported from legacy src/pages/onboarding/OnboardingPage.jsx.
 * Form logic unchanged; styling refactored to Tailwind + shadcn Card while keeping
 * the FinJar green palette (#0F6E56, #134e3a, #f0faf5, #d1fae5, #E1F5EE).
 */
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants/routes";
import {
  AGE_RANGE_OPTIONS,
  BUDGET_METHOD,
  FINANCIAL_GOAL_OPTIONS,
  METHOD_CARDS,
  OCCUPATION_OPTIONS,
  ONBOARDING_UI,
  SPENDING_CHALLENGE_OPTIONS,
  type BudgetMethodId,
} from "@/constants/onboarding";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store";
import {
  onboardingService,
  type SuggestionRow,
} from "@/services/onboardingService";

const TOTAL_STEPS = 4;
const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const formatVnd = (amount: number) => vndFormatter.format(amount);

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#d1fae5] bg-white px-3 py-2 text-sm text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56]/40";

function toggleInList<T>(list: T[], value: T): T[] {
  if (list.includes(value)) return list.filter((v) => v !== value);
  return [...list, value];
}

function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(15000000);
  const [occupation, setOccupation] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [financialGoals, setFinancialGoals] = useState<string[]>([]);
  const [spendingChallenges, setSpendingChallenges] = useState<string[]>([]);
  const [budgetingMethod, setBudgetingMethod] = useState<BudgetMethodId | null>(null);
  const [suggestionRows, setSuggestionRows] = useState<SuggestionRow[]>([]);

  const incomeNumber = useMemo(
    () => (typeof monthlyIncome === "number" && !Number.isNaN(monthlyIncome) ? monthlyIncome : 0),
    [monthlyIncome],
  );

  useEffect(() => {
    if (step < 4 || !budgetingMethod) return;
    let cancelled = false;
    const load = async () => {
      try {
        const rows = await onboardingService.getSuggestionsForIncome(budgetingMethod, incomeNumber);
        if (cancelled) return;
        setSuggestionRows(rows);
      } catch {
        if (!cancelled) setSuggestionRows([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [step, budgetingMethod, incomeNumber]);

  const canStep1 = incomeNumber > 0 && Boolean(occupation) && Boolean(ageRange);
  const canStep2 = financialGoals.length > 0 && spendingChallenges.length > 0;
  const canStep3 = Boolean(budgetingMethod);

  const canNext = () => {
    if (step === 1) return canStep1;
    if (step === 2) return canStep2;
    if (step === 3) return canStep3;
    return true;
  };

  const buildFormPayload = () => ({
    monthlyIncome: incomeNumber,
    occupation,
    ageRange,
    financialGoals,
    spendingChallenges,
    budgetingMethod,
  });

  const onSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const form = buildFormPayload();
      const result = await onboardingService.complete(form);
      if (result?.success !== false) {
        setUser({ isOnboardingCompleted: true, is_onboarding_completed: true });
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        setSubmitError(ONBOARDING_UI.submitError);
      }
    } catch (err: unknown) {
      const maybe = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = maybe?.response?.data?.message || maybe?.message || ONBOARDING_UI.submitError;
      setSubmitError(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.isOnboardingCompleted === true || user?.is_onboarding_completed === true) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };
  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen bg-[#f0faf5] px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-xs text-slate-500">
          {ONBOARDING_UI.stepLabel(step, TOTAL_STEPS)} — {ONBOARDING_UI.pageTitle}
        </p>
        <h1 className="mt-1 mb-1 text-xl font-bold text-[#0F6E56]">
          Khởi tạo tài chính cá nhân
        </h1>
        {submitError ? (
          <p className="mb-2 text-xs text-red-700">{submitError}</p>
        ) : null}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`h-1 flex-1 min-w-16 rounded ${
                n <= step ? "bg-[#0F6E56]" : "bg-slate-200"
              } ${n < TOTAL_STEPS ? "mr-1" : ""}`}
            />
          ))}
        </div>

        {step === 1 && (
          <Card className="mb-4 border-[#d1fae5] bg-white">
            <CardContent className="pt-6">
              <h2 className="mb-3 text-base font-semibold text-[#134e3a]">
                Thông tin cơ bản
              </h2>
              <p className="text-sm text-slate-700">
                Nhập thu nhập và tình hình công việc.
              </p>
              <div className="mt-3.5 flex flex-col gap-3">
                <label className="block text-sm text-slate-700">
                  {ONBOARDING_UI.monthlyIncome}
                  <input
                    type="number"
                    min={0}
                    value={Number.isNaN(monthlyIncome) ? "" : monthlyIncome}
                    onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                  <span className="mt-1 block text-xs text-slate-500">
                    {formatVnd(incomeNumber)}
                  </span>
                </label>
                <label className="block text-sm text-slate-700">
                  {ONBOARDING_UI.occupation}
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">-- Chọn --</option>
                    {OCCUPATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-slate-700">
                  {ONBOARDING_UI.ageRange}
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">-- Chọn --</option>
                    {AGE_RANGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="mb-4 border-[#d1fae5] bg-white">
            <CardContent className="pt-6">
              <h2 className="mb-3 text-base font-semibold text-[#134e3a]">
                {ONBOARDING_UI.financialGoals}
              </h2>
              <div className="flex flex-col gap-2">
                {FINANCIAL_GOAL_OPTIONS.map((g) => (
                  <label
                    key={g.value}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={financialGoals.includes(g.value)}
                      onChange={() =>
                        setFinancialGoals((prev) => toggleInList(prev, g.value))
                      }
                      className="h-4 w-4 accent-[#0F6E56]"
                    />
                    {g.label}
                  </label>
                ))}
              </div>
              <h2 className="mt-5 mb-3 text-base font-semibold text-[#134e3a]">
                {ONBOARDING_UI.challenges}
              </h2>
              <div className="flex flex-col gap-2">
                {SPENDING_CHALLENGE_OPTIONS.map((g) => (
                  <label
                    key={g.value}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={spendingChallenges.includes(g.value)}
                      onChange={() =>
                        setSpendingChallenges((prev) => toggleInList(prev, g.value))
                      }
                      className="h-4 w-4 accent-[#0F6E56]"
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="mb-4 border-[#d1fae5] bg-white">
            <CardContent className="pt-6">
              <h2 className="mb-3 text-base font-semibold text-[#134e3a]">
                {ONBOARDING_UI.methodTitle}
              </h2>
              <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
                {METHOD_CARDS.map((m) => {
                  const active = budgetingMethod === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setBudgetingMethod(m.id)}
                      className={`cursor-pointer rounded-xl p-4 text-left transition-colors ${
                        active
                          ? "border-2 border-[#0F6E56] bg-[#E1F5EE]"
                          : "border border-[#d1fae5] bg-white hover:bg-[#f0faf5]"
                      }`}
                    >
                      <div className="text-sm font-semibold text-[#0F6E56]">
                        {m.title}
                      </div>
                      <p className="mt-2 text-xs text-slate-700">{m.description}</p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="mb-4 border-[#d1fae5] bg-white">
            <CardContent className="pt-6">
              <h2 className="mb-3 text-base font-semibold text-[#134e3a]">
                {budgetingMethod === BUDGET_METHOD.CUSTOM
                  ? "Bạn chọn tùy chỉnh hũ"
                  : ONBOARDING_UI.reviewTitle}
              </h2>
              {budgetingMethod === BUDGET_METHOD.CUSTOM ? (
                <p className="text-sm text-slate-700">
                  Bạn có thể cấu hình chi tiết ở trang hũ sau bước này.
                </p>
              ) : (
                <ul className="flex flex-col gap-2.5 p-0">
                  {suggestionRows.map((j) => (
                    <li
                      key={j.name}
                      className="flex items-center justify-between rounded-[10px] border border-[#d1fae5] bg-white px-3 py-2.5"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <span aria-hidden>{j.icon}</span> {j.name} — {j.percentage}%
                      </span>
                      <span className="font-semibold text-[#0F6E56]">
                        {formatVnd(j.monthlyAmount)}/tháng
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2.5 text-xs text-slate-500">
                Từ thu nhập:{" "}
                <strong className="text-[#0F6E56]">{formatVnd(incomeNumber)}</strong> / tháng
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={submitting}
                className="border-[#d1fae5] text-[#0F6E56] hover:bg-[#f0faf5]"
              >
                {ONBOARDING_UI.back}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < TOTAL_STEPS && (
              <Button
                type="button"
                onClick={goNext}
                disabled={!canNext() || submitting}
                className="bg-[#0F6E56] text-white hover:bg-[#0c5a46]"
              >
                {ONBOARDING_UI.next}
              </Button>
            )}
            {step === TOTAL_STEPS && (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="bg-[#0F6E56] text-white hover:bg-[#0c5a46]"
              >
                {submitting ? "Đang lưu…" : ONBOARDING_UI.reviewSubmit}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
