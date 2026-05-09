import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Gamepad2,
  Mountain,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { useJars } from "@/features/jars/hooks/useJars";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

function SoftProgress({ value, className }: { value: number; className?: string }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={cn("h-full rounded-full transition-all duration-500", className)}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

const demoGoals = [
  { title: "Du lịch hè", amount: "12.500.000 ₫", icon: Mountain, color: "bg-amber-100 text-amber-700" },
  { title: "Sửa nhà", amount: "45.000.000 ₫", icon: Utensils, color: "bg-rose-100 text-rose-700" },
  { title: "Console game", amount: "8.200.000 ₫", icon: Gamepad2, color: "bg-violet-100 text-violet-700" },
];

const outcomeCategories = [
  { label: "Ăn uống & siêu thị", pct: 52, bar: "bg-orange-400", icon: ShoppingBag, iconBg: "bg-orange-100 text-orange-600" },
  { label: "Di chuyển & xăng", pct: 21, bar: "bg-emerald-400", icon: ShoppingBag, iconBg: "bg-emerald-100 text-emerald-600" },
  { label: "Giải trí", pct: 74, bar: "bg-sky-400", icon: ShoppingBag, iconBg: "bg-sky-100 text-sky-600" },
];

const quickContacts = [
  { name: "An", initial: "A" },
  { name: "Bình", initial: "B" },
  { name: "Chi", initial: "C" },
  { name: "Dung", initial: "D" },
];

export function UserDashboardPage() {
  const { data: dash, isLoading: dashLoading } = useDashboard();
  const { data: tx, isLoading: txLoading } = useTransactions();
  const { data: jars } = useJars();
  const [cardFrozen, setCardFrozen] = useState(false);
  const [quickAmount, setQuickAmount] = useState("");

  const stats = useMemo(() => {
    if (dash?.balanceSummary) {
      const { totalIncome, totalExpense, totalBalance } = dash.balanceSummary;
      const weeklyCap = 4_000_000;
      const spent = Math.min(weeklyCap, totalExpense);
      return {
        income: totalIncome,
        expense: totalExpense,
        balance: totalBalance,
        weeklyCap,
        spent,
        weeklyPct: weeklyCap ? (spent / weeklyCap) * 100 : 0,
      };
    }
    const rows = tx ?? [];
    let income = 0;
    let expense = 0;
    for (const t of rows) {
      if (t.type === "Income") income += t.amount;
      else expense += t.amount;
    }
    const balance = income - expense;
    const weeklyCap = 4_000_000;
    const spent = Math.min(weeklyCap, expense);
    return {
      income,
      expense,
      balance,
      weeklyCap,
      spent,
      weeklyPct: weeklyCap ? (spent / weeklyCap) * 100 : 0,
    };
  }, [dash, tx]);

  const previewRows = useMemo(() => {
    if (dash?.recentTransactions?.length) {
      return dash.recentTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.transactionsAmount,
        note: t.note ?? "",
        transactionDate: t.date,
      }));
    }
    return (tx ?? []).slice(0, 5);
  }, [dash, tx]);

  const categoryRows = useMemo(() => {
    if (dash?.categoryBreakdown?.length) {
      const bars = ["bg-orange-400", "bg-emerald-400", "bg-sky-400", "bg-violet-400"] as const;
      const bgs = [
        "bg-orange-100 text-orange-600",
        "bg-emerald-100 text-emerald-600",
        "bg-sky-100 text-sky-600",
        "bg-violet-100 text-violet-600",
      ] as const;
      return dash.categoryBreakdown.map((c, i) => ({
        label: c.categoryName,
        pct: Math.min(100, Math.round(Number(c.percentage) || 0)),
        bar: bars[i % bars.length]!,
        icon: ShoppingBag,
        iconBg: bgs[i % bgs.length]!,
      }));
    }
    return outcomeCategories;
  }, [dash]);

  const jarCards = useMemo(() => {
    if (dash?.jarSummary?.length) {
      return dash.jarSummary.map((j) => ({
        id: j.jarId,
        name: j.jarName,
        balance: j.balance,
      }));
    }
    return jars ?? [];
  }, [dash, jars]);

  const listLoading = dashLoading || txLoading;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_min(100%,380px)] lg:items-start">
      <div className="space-y-6">
        <div className="flex flex-col gap-6 rounded-[1.5rem] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 md:flex-row md:items-stretch md:p-8">
          <div
            className={cn(
              "relative flex min-h-[200px] w-full shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#5B7CFF] via-[#4A6CF5] to-[#3B5BDB] p-6 text-white shadow-lg shadow-blue-500/25 md:w-[320px]",
              cardFrozen && "opacity-80 grayscale-[0.2]",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.35) 0%, transparent 45%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)",
              }}
            />
            <div className="relative flex items-start justify-between">
              <span className="text-lg font-semibold tracking-wide">FinJar</span>
              <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                Debit
              </span>
            </div>
            <div className="relative space-y-4">
              <p className="font-mono text-lg tracking-[0.2em]">5789 ···· ···· 2847</p>
              <div className="flex items-end justify-between text-sm opacity-90">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Chủ thẻ</p>
                  <p className="font-medium">Nguyễn Minh</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Hết hạn</p>
                  <p className="font-medium">09/28</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-5 md:pl-2">
            <div>
              <p className="text-sm text-slate-500">Số dư hiện tại</p>
              <p className="text-3xl font-bold tracking-tight text-slate-800">
                {formatCurrency(stats.balance || 0)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-emerald-50/80 px-4 py-3 ring-1 ring-emerald-100">
                <p className="text-xs font-medium text-emerald-700">Thu</p>
                <p className="text-lg font-semibold text-emerald-800">
                  {formatCurrency(stats.income || 0)}
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50/80 px-4 py-3 ring-1 ring-rose-100">
                <p className="text-xs font-medium text-rose-700">Chi</p>
                <p className="text-lg font-semibold text-rose-800">
                  {formatCurrency(stats.expense || 0)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Hạn mức chi tuần</span>
                <span className="font-medium text-slate-800">
                  {formatCurrency(stats.spent)} / {formatCurrency(stats.weeklyCap)}
                </span>
              </div>
              <SoftProgress value={stats.weeklyPct || 0} className="bg-gradient-to-r from-amber-400 to-amber-500" />
            </div>
            <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-700">Tạm khóa thẻ</span>
              <button
                type="button"
                role="switch"
                aria-checked={cardFrozen}
                onClick={() => setCardFrozen(!cardFrozen)}
                className={cn(
                  "relative h-7 w-12 rounded-full transition-colors",
                  cardFrozen ? "bg-slate-300" : "bg-[#4A6CF5]",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-6 rounded-full bg-white shadow-md transition-all",
                    cardFrozen ? "left-0.5" : "left-6",
                  )}
                />
              </button>
            </label>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-100 md:p-6">
          <h2 className="text-lg font-semibold text-slate-800">Lịch sử giao dịch</h2>
          <p className="text-sm text-slate-500">Các khoản gần đây (theo dữ liệu app)</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-slate-500">Đối tác / Ghi chú</TableHead>
                  <TableHead className="text-slate-500">Loại</TableHead>
                  <TableHead className="text-slate-500">Ngày</TableHead>
                  <TableHead className="text-right text-slate-500">Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-slate-500">
                      Đang tải…
                    </TableCell>
                  </TableRow>
                )}
                {!listLoading && previewRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-slate-500">
                      Chưa có giao dịch. Thêm từ mục Giao dịch.
                    </TableCell>
                  </TableRow>
                )}
                {previewRows.map((item) => (
                  <TableRow key={item.id} className="border-slate-50">
                    <TableCell className="font-medium text-slate-800">
                      <span className="inline-flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs">
                          {item.note?.charAt(0) ?? "·"}
                        </span>
                        {item.note || "Không ghi chú"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">{item.type === "Income" ? "Thu" : "Chi"}</TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(item.transactionDate).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold",
                        item.type === "Income" ? "text-emerald-600" : "text-rose-600",
                      )}
                    >
                      {item.type === "Income" ? "+" : "−"}
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-6">
        <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-100">
          <h3 className="font-semibold text-slate-800">Mục tiêu</h3>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {dash?.goalProgress?.length
              ? dash.goalProgress.map((g) => (
                  <div
                    key={g.goalId}
                    className="min-w-[140px] shrink-0 rounded-2xl bg-slate-50/90 p-4 ring-1 ring-slate-100"
                  >
                    <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <Mountain className="size-5" />
                    </div>
                    <p className="text-xs text-slate-500">{Math.round(g.progressPercentage)}% • {g.daysRemaining} ngày</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{g.title}</p>
                  </div>
                ))
              : null}
            {!dash?.goalProgress?.length &&
              jarCards.map((j, i) => {
                const g = demoGoals[i % demoGoals.length]!;
                const Icon = g.icon;
                return (
                  <div
                    key={j.id}
                    className="min-w-[140px] shrink-0 rounded-2xl bg-slate-50/90 p-4 ring-1 ring-slate-100"
                  >
                    <div className={cn("mb-2 flex size-10 items-center justify-center rounded-xl", g.color)}>
                      <Icon className="size-5" />
                    </div>
                    <p className="text-xs text-slate-500">{formatCurrency(j.balance)}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{j.name}</p>
                  </div>
                );
              })}
            {!dash?.goalProgress?.length && jarCards.length === 0 &&
              demoGoals.map((g) => (
                <div
                  key={g.title}
                  className="min-w-[140px] shrink-0 rounded-2xl bg-slate-50/90 p-4 ring-1 ring-slate-100"
                >
                  <div className={cn("mb-2 flex size-10 items-center justify-center rounded-xl", g.color)}>
                    <g.icon className="size-5" />
                  </div>
                  <p className="text-xs text-slate-500">{g.amount}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{g.title}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-100">
          <h3 className="font-semibold text-slate-800">Chi theo nhóm</h3>
          <div className="mt-4 space-y-4">
            {categoryRows.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", c.iconBg)}>
                  <c.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="truncate font-medium text-slate-700">{c.label}</span>
                    <span className="text-slate-500">{c.pct}%</span>
                  </div>
                  <SoftProgress value={c.pct} className={c.bar} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-100">
          <h3 className="font-semibold text-slate-800">Chuyển nhanh</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickContacts.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-center"
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#5B7CFF] to-[#3B5BDB] text-sm font-bold text-white shadow-md shadow-blue-500/30">
                  {p.initial}
                </div>
                <span className="text-[11px] font-medium text-slate-600">{p.name}</span>
              </div>
            ))}
            <Link
              to={ROUTES.TRANSACTIONS_ADD}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-[11px] font-medium text-slate-500 transition hover:border-[#4A6CF5] hover:text-[#4A6CF5]"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-lg leading-none text-slate-400">
                +
              </span>
              Thêm
            </Link>
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Số tiền"
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              className="rounded-xl border-slate-200"
            />
            <Button
              asChild
              className="shrink-0 rounded-xl bg-[#FCD34D] px-5 font-semibold text-slate-900 shadow-sm hover:bg-[#FBBF24]"
            >
              <Link to={ROUTES.TRANSACTIONS_ADD}>
                Gửi <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-6 text-white shadow-lg shadow-orange-500/25">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 70%, white 0%, transparent 50%)",
            }}
          />
          <div className="relative">
            <p className="text-sm font-medium opacity-90">Ưu đãi hôm nay</p>
            <p className="mt-2 text-xl font-bold leading-snug">Vay linh hoạt, duyệt nhanh</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 rounded-full bg-white/95 font-semibold text-orange-600 hover:bg-white"
            >
              Tìm hiểu <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
