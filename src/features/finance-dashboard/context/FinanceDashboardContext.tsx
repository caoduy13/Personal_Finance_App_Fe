import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserDashboardData } from "@/features/dashboard/types";
import {
  CASH_FLOW_MONTHS,
  getCashFlowForMonth,
  profitLossSummary,
} from "../mockData";
import { t, type TranslationKey } from "../i18n";
import { formatMonthLabel } from "../utils/locale";
import { formatVnd } from "@/shared/lib/formatCurrency";
import type { Currency, Language, UserPreferences } from "../types";

const STORAGE_KEY = "finance-dashboard-prefs";

type StoredState = {
  preferences: UserPreferences;
  selectedMonth: string;
};

const defaultPreferences: UserPreferences = {
  emailNotifications: true,
  twoFactor: false,
  currency: "VND",
  language: "vi",
};

function loadStored(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        preferences: defaultPreferences,
        selectedMonth: CASH_FLOW_MONTHS[0],
      };
    }
    const parsed = JSON.parse(raw) as Partial<StoredState> & {
      preferences?: Partial<UserPreferences> & { avatarVariant?: string };
    };
    const prefs: Partial<UserPreferences> & { avatarVariant?: string } =
      parsed.preferences ?? {};
    const restPrefs = { ...prefs };
    delete restPrefs.avatarVariant;
    return {
      preferences: {
        ...defaultPreferences,
        ...restPrefs,
      },
      selectedMonth:
        parsed.selectedMonth &&
        CASH_FLOW_MONTHS.includes(
          parsed.selectedMonth as (typeof CASH_FLOW_MONTHS)[number],
        )
          ? parsed.selectedMonth
          : CASH_FLOW_MONTHS[0],
    };
  } catch {
    return {
      preferences: defaultPreferences,
      selectedMonth: CASH_FLOW_MONTHS[0],
    };
  }
}

function cashFlowFromDashboard(data: UserDashboardData) {
  const { balanceSummary: bs } = data;
  return {
    inflow: bs.totalIncome,
    outflow: bs.totalExpense,
    netChanges: bs.netChange,
  };
}

type ProfitLossDisplay = {
  inflowToday: number;
  changePercent: number;
  inflowTotal: number;
  outflowTotal: number;
};

type FinanceDashboardContextValue = {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  cashFlow: ReturnType<typeof getCashFlowForMonth>;
  profitLoss: ProfitLossDisplay;
  format: (amount: number) => string;
  formatMonth: (monthKey: string) => string;
  tr: (key: TranslationKey) => string;
  language: Language;
  currency: Currency;
  dashboardData: UserDashboardData | null;
};

const FinanceDashboardContext =
  createContext<FinanceDashboardContextValue | null>(null);

type FinanceDashboardProviderProps = {
  children: ReactNode;
  dashboardData?: UserDashboardData | null;
};

export function FinanceDashboardProvider({
  children,
  dashboardData = null,
}: FinanceDashboardProviderProps) {
  const [stored, setStored] = useState(loadStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }, [stored]);

  const { preferences, selectedMonth } = stored;

  const setPreferences = useCallback((prefs: UserPreferences) => {
    setStored((s) => ({ ...s, preferences: prefs }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setStored((s) => ({
      ...s,
      preferences: { ...s.preferences, ...patch },
    }));
  }, []);

  const setSelectedMonth = useCallback((month: string) => {
    setStored((s) => ({ ...s, selectedMonth: month }));
  }, []);

  const value = useMemo<FinanceDashboardContextValue>(() => {
    const { currency, language } = preferences;
    const mockCashFlow = getCashFlowForMonth(selectedMonth);
    const cashFlow = dashboardData
      ? cashFlowFromDashboard(dashboardData)
      : mockCashFlow;

    const profitLoss: ProfitLossDisplay = dashboardData
      ? {
          inflowToday: dashboardData.recentTransactions
            .filter((t) => t.type === "Income")
            .reduce((sum, t) => sum + t.transactionsAmount, 0),
          changePercent:
            dashboardData.balanceSummary.totalIncome > 0
              ? Math.min(
                  99,
                  Math.round(
                    (dashboardData.balanceSummary.netChange /
                      dashboardData.balanceSummary.totalIncome) *
                      100,
                  ),
                )
              : 0,
          inflowTotal: dashboardData.balanceSummary.totalIncome,
          outflowTotal: dashboardData.balanceSummary.totalExpense,
        }
      : profitLossSummary;

    return {
      preferences,
      setPreferences,
      updatePreferences,
      selectedMonth,
      setSelectedMonth,
      cashFlow,
      profitLoss,
      format: (amount: number) => formatVnd(amount),
      formatMonth: (monthKey: string) => formatMonthLabel(monthKey, language),
      tr: (key) => t(language, key),
      language,
      currency,
      dashboardData,
    };
  }, [
    preferences,
    selectedMonth,
    setPreferences,
    updatePreferences,
    setSelectedMonth,
    dashboardData,
  ]);

  return (
    <FinanceDashboardContext.Provider value={value}>
      {children}
    </FinanceDashboardContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFinanceDashboard() {
  const ctx = useContext(FinanceDashboardContext);
  if (!ctx) {
    throw new Error(
      "useFinanceDashboard must be used within FinanceDashboardProvider",
    );
  }
  return ctx;
}
