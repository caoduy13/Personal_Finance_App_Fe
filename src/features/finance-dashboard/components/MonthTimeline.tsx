import { cn } from "@/lib/utils";
import { CASH_FLOW_MONTHS } from "../mockData";
import { useFinanceDashboard } from "../context/FinanceDashboardContext";

export function MonthTimeline() {
  const { selectedMonth, setSelectedMonth, formatMonth } = useFinanceDashboard();

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {CASH_FLOW_MONTHS.map((month) => (
        <button
          key={month}
          type="button"
          onClick={() => setSelectedMonth(month)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition",
            selectedMonth === month
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
          )}
        >
          {formatMonth(month)}
        </button>
      ))}
    </div>
  );
}
