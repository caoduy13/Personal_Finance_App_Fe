import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CASH_FLOW_MONTHS, getCashFlowForMonth } from "../mockData";
import { t, type TranslationKey } from "../i18n";
import { formatMonthLabel } from "../utils/locale";
import { formatMoney } from "../utils/formatMoney";
import type { Currency, Language, UserPreferences } from "../types";

const STORAGE_KEY = "finance-dashboard-prefs";

type StoredState = {
  preferences: UserPreferences;
  selectedMonth: string;
};

const defaultPreferences: UserPreferences = {
  emailNotifications: true,
  twoFactor: false,
  currency: "USD",
  language: "en",
  avatarImageUrl: null,
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
        avatarImageUrl: prefs.avatarImageUrl ?? null,
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

type FinanceDashboardContextValue = {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  cashFlow: ReturnType<typeof getCashFlowForMonth>;
  format: (amountUsd: number) => string;
  formatMonth: (monthKey: string) => string;
  tr: (key: TranslationKey) => string;
  language: Language;
  currency: Currency;
  avatarImageUrl: string | null;
};

const FinanceDashboardContext =
  createContext<FinanceDashboardContextValue | null>(null);

export function FinanceDashboardProvider({ children }: { children: ReactNode }) {
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
    const { currency, language, avatarImageUrl } = preferences;
    return {
      preferences,
      setPreferences,
      updatePreferences,
      selectedMonth,
      setSelectedMonth,
      cashFlow: getCashFlowForMonth(selectedMonth),
      format: (amountUsd: number) => formatMoney(amountUsd, currency),
      formatMonth: (monthKey: string) => formatMonthLabel(monthKey, language),
      tr: (key) => t(language, key),
      language,
      currency,
      avatarImageUrl,
    };
  }, [
    preferences,
    selectedMonth,
    setPreferences,
    updatePreferences,
    setSelectedMonth,
  ]);

  return (
    <FinanceDashboardContext.Provider value={value}>
      {children}
    </FinanceDashboardContext.Provider>
  );
}

// Hook export alongside Provider — same pattern as shared UI modules.
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
