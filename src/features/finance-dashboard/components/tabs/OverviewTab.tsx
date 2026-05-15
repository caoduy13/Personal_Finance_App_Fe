import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
} from "lucide-react";
import {
  MONTH_RANGE_OPTIONS,
  netIncomeRowKeys,
  payableBills,
  payableInvoices,
  profitLossSummary,
} from "../../mockData";
import { useFinanceDashboard } from "../../context/FinanceDashboardContext";
import { formatMonthRangeOption } from "../../utils/locale";
import type { TranslationKey } from "../../i18n";
import { MonthTimeline } from "../MonthTimeline";
import { ProfitLossChart } from "../ProfitLossChart";
import {
  DropdownPill,
  LegendDot,
  ViewReportButton,
} from "../shared";

export function OverviewTab() {
  const { cashFlow, format, tr, selectedMonth, formatMonth, language } =
    useFinanceDashboard();
  const rangeLabel = (opt: string) => formatMonthRangeOption(opt, language);
  const [monthRange, setMonthRange] = useState<string>(MONTH_RANGE_OPTIONS[0]);
  const [plMonthRange, setPlMonthRange] = useState<string>(
    MONTH_RANGE_OPTIONS[0],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{tr("cashFlow")}</h2>
            <p className="text-xs text-neutral-500">{formatMonth(selectedMonth)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownPill
              value={monthRange}
              onValueChange={setMonthRange}
              options={MONTH_RANGE_OPTIONS}
              getLabel={rangeLabel}
            />
            <ViewReportButton label={tr("viewReport")} />
          </div>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {tr("cashFlowDesc")}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <LegendDot color="bg-green-400" />
            {tr("inflow")}
          </span>
          <span className="flex items-center gap-1.5">
            <LegendDot color="bg-neutral-900 dark:bg-white" />
            {tr("outflow")}
          </span>
          <span className="flex items-center gap-1.5">
            <LegendDot color="#a855f7" outline />
            {tr("netChanges")}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex min-h-[140px] flex-col justify-between rounded-2xl bg-green-200/80 p-4 shadow-sm dark:bg-green-900/40">
            <ArrowDownLeft className="h-5 w-5 text-green-800 dark:text-green-300" />
            <div>
              <p className="text-sm font-medium text-green-900/80 dark:text-green-200">
                {tr("inflow")}
              </p>
              <p className="text-xl font-bold text-green-950 dark:text-green-100">
                {format(cashFlow.inflow)}
              </p>
            </div>
          </div>
          <div className="flex min-h-[140px] flex-col justify-between rounded-2xl bg-purple-200/80 p-4 shadow-sm dark:bg-purple-900/40">
            <ArrowUpRight className="h-5 w-5 text-purple-800 dark:text-purple-300" />
            <div>
              <p className="text-sm font-medium text-purple-900/80 dark:text-purple-200">
                {tr("outflow")}
              </p>
              <p className="text-xl font-bold text-purple-950 dark:text-purple-100">
                {format(cashFlow.outflow)}
              </p>
            </div>
          </div>
          <div className="flex min-h-[140px] flex-col justify-between rounded-2xl bg-neutral-900 p-4 text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
            <ArrowLeftRight className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-neutral-300 dark:text-neutral-600">
                {tr("netChanges")}
              </p>
              <p className="text-xl font-bold">{format(cashFlow.netChanges)}</p>
            </div>
          </div>
        </div>

        <MonthTimeline />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-bold">{tr("profitLoss")}</h2>
          <div className="flex flex-wrap gap-2">
            <ViewReportButton label={tr("viewReport")} />
            <DropdownPill
              value={plMonthRange}
              onValueChange={setPlMonthRange}
              options={MONTH_RANGE_OPTIONS}
              getLabel={rangeLabel}
            />
          </div>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {tr("profitLossDesc")}
        </p>

        <div className="flex gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <LegendDot color="bg-green-400" />
            {tr("inflow")}
          </span>
          <span className="flex items-center gap-1.5">
            <LegendDot color="bg-purple-400" />
            {tr("outflow")}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl bg-neutral-900 p-5 text-white shadow-xl dark:bg-neutral-100 dark:text-neutral-900">
          <div className="flex items-start justify-between">
            <div />
            <span className="rounded-md bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400 dark:text-green-700">
              +{profitLossSummary.changePercent}%
            </span>
          </div>
          <div className="py-4 text-center">
            <p className="text-5xl font-bold text-green-400 dark:text-green-600">
              {profitLossSummary.inflowToday}
            </p>
            <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-600">
              {tr("inflowToday")}
            </p>
          </div>
          <ProfitLossChart />
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-4 dark:border-neutral-200">
            <div>
              <div className="mb-2 flex h-8 items-end gap-0.5">
                {[40, 65, 50, 80, 55, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-green-400/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold">
                {format(profitLossSummary.inflowTotal)} {tr("inflow")}
              </p>
            </div>
            <div>
              <div className="mb-2 flex h-8 items-end gap-0.5">
                {[20, 35, 25].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-purple-400/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold">
                {format(profitLossSummary.outflowTotal)} {tr("outflow")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">{tr("netIncome")}</h2>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-800">
            <span>{tr("fiscalYear")}</span>
            <span className="text-right">{tr("year2020")}</span>
            <span className="text-right">{tr("year2021")}</span>
          </div>
          {netIncomeRowKeys.map((row) => (
            <div
              key={row.labelKey}
              className="grid grid-cols-3 gap-2 border-b border-neutral-100 px-3 py-2 last:border-0 dark:border-neutral-800"
            >
              <span className="my-1 flex items-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium dark:border-neutral-700">
                {tr(row.labelKey as TranslationKey)}
              </span>
              <span className="my-1 flex items-center justify-end rounded-full border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">
                {format(row.y2020)}
              </span>
              <span className="my-1 flex items-center justify-end rounded-full border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">
                {format(row.y2021)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">{tr("payableOwing")}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              {tr("invoicesPayable")}
            </h3>
            <ul className="space-y-2">
              {payableInvoices.map((item) => (
                <li
                  key={item.labelKey}
                  className="flex items-center justify-between rounded-full border border-neutral-200 px-4 py-2.5 text-sm dark:border-neutral-700"
                >
                  <span>{tr(item.labelKey as TranslationKey)}</span>
                  <span className="font-medium">{format(item.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              {tr("billsYouOwe")}
            </h3>
            <ul className="space-y-2">
              {payableBills.map((item) => (
                <li
                  key={item.labelKey}
                  className="flex items-center justify-between rounded-full border border-neutral-200 px-4 py-2.5 text-sm dark:border-neutral-700"
                >
                  <span>{tr(item.labelKey as TranslationKey)}</span>
                  <span className="font-medium">{format(item.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
