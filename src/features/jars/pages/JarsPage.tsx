import { PiggyBank } from "lucide-react";
import { useJars } from "../hooks/useJars";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function JarsPage() {
  const { data, isLoading, isError } = useJars();

  if (isLoading) {
    return (
      <p className="text-sm font-medium text-slate-500">Đang tải hũ tiền…</p>
    );
  }
  if (isError || !data) {
    return (
      <p className="text-sm font-medium text-rose-600">Không tải được hũ.</p>
    );
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((jar, i) => (
        <div
          key={jar.id}
          className={cn(
            "rounded-[1.25rem] border border-slate-100 bg-white p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)] transition hover:shadow-[0_12px_40px_-12px_rgba(15,23,42,0.14)]",
            i === 0 && "sm:col-span-2 xl:col-span-1 ring-2 ring-[#4A6CF5]/15",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className="flex size-12 items-center justify-center rounded-2xl text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${jar.color || "#5B7CFF"}, #3B5BDB)`,
              }}
            >
              <PiggyBank className="size-6" />
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {jar.percentage ?? 0}% phân bổ
            </span>
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">{jar.name}</h2>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#3B5BDB]">
            {formatCurrency(jar.balance)}
          </p>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Trạng thái: {jar.status}
          </p>
        </div>
      ))}
    </section>
  );
}
