import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/lib/utils";
import { CASH_FLOW_MONTHS, calendarEvents } from "../mockData";
import { useFinanceDashboard } from "../context/FinanceDashboardContext";
import { formatCalendarMonthShort } from "../utils/locale";
import { MonthTimeline } from "./MonthTimeline";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function IconCircleButton({
  children,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
      {children}
    </button>
  );
}

export function CalendarPopover() {
  const { selectedMonth, setSelectedMonth, tr, language } = useFinanceDashboard();
  const [viewYear, setViewYear] = useState(2021);
  const [open, setOpen] = useState(false);

  const quickSelect = (month: string) => {
    setSelectedMonth(month);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <IconCircleButton aria-label={tr("calendar")}>
            <CalendarIcon className="h-4 w-4" />
          </IconCircleButton>
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[320px] p-0 dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
          <p className="font-semibold">{tr("calendar")}</p>
          <p className="text-xs text-neutral-500">{tr("selectMonth")}</p>
        </div>

        <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Previous year"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Next year"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {MONTH_LABELS.map((label) => {
              const shortYear = String(viewYear).slice(-2);
              const key = `${label} ${shortYear}` as (typeof CASH_FLOW_MONTHS)[number];
              const exists = CASH_FLOW_MONTHS.includes(key);
              const isActive = selectedMonth === key;
              return (
                <button
                  key={label}
                  type="button"
                  disabled={!exists}
                  onClick={() => exists && quickSelect(key)}
                  className={cn(
                    "rounded-lg py-2 text-xs font-medium transition",
                    !exists && "cursor-not-allowed opacity-30",
                    exists &&
                      (isActive
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"),
                  )}
                >
                  {formatCalendarMonthShort(label, language)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-3 py-2">
          <MonthTimeline />
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800">
          <p className="px-4 py-2 text-xs font-semibold uppercase text-neutral-500">
            {tr("upcomingEvents")}
          </p>
          <ul className="max-h-40 overflow-y-auto px-2 pb-2">
            {calendarEvents.map((ev) => (
              <li key={ev.id}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <p className="font-medium">{tr(ev.titleKey)}</p>
                  <p className="text-xs text-neutral-500">
                    {ev.date} ·{" "}
                    {"timeKey" in ev ? tr(ev.timeKey) : ev.time}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
