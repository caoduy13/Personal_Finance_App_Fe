import { WalletCards } from "lucide-react";
import { useBudgetLimits } from "../hooks/useBudget";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function BudgetPage() {
  const { data, isLoading, isError } = useBudgetLimits();

  if (isLoading) {
    return (
      <p className="text-sm font-medium text-slate-500">Đang tải hạn mức…</p>
    );
  }
  if (isError || !data) {
    return (
      <p className="text-sm font-medium text-rose-600">Không tải được ngân sách.</p>
    );
  }

  return (
    <section className="grid gap-5 md:grid-cols-2">
      {data.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            "rounded-[1.35rem] border border-slate-100 bg-white p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)]",
            i % 2 === 0 ? "md:ring-1 md:ring-blue-100" : "md:ring-1 md:ring-amber-100",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5B7CFF]/15 to-[#3B5BDB]/10 text-[#3B5BDB]">
              <WalletCards className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {item.period}
              </p>
              <h2 className="text-lg font-bold text-slate-900">Hạn mức</h2>
            </div>
          </div>
          <p className="mt-5 text-2xl font-bold text-slate-800">
            {formatCurrency(item.limitAmount)}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="rounded-xl bg-slate-50 px-3 py-1.5 font-medium ring-1 ring-slate-100">
              Cảnh báo {item.alertAtPercentage}%
            </span>
            <span
              className={cn(
                "rounded-xl px-3 py-1.5 font-semibold ring-1",
                item.isActive
                  ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
                  : "bg-slate-100 text-slate-500 ring-slate-200",
              )}
            >
              {item.isActive ? "Đang bật" : "Tắt"}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
