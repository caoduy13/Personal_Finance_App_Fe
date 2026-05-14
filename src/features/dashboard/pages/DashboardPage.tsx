import { Link } from "react-router-dom";
import {
  Goal,
  PiggyBank,
  Plus,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants/routes";
import { useUserDashboard } from "../hooks/useUserDashboard";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useUserDashboard();

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Đang tải tổng quan...</p>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">Không tải được dashboard.</p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          Thử lại
        </Button>
      </div>
    );
  }

  const { balanceSummary: bs } = data;
  const hasAccounts = data.financialAccounts.length > 0;
  const hasJars = data.jarSummary.length > 0;
  const hasRecentTx = data.recentTransactions.length > 0;

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-violet-200/80 bg-linear-to-br from-violet-50 via-white to-indigo-50/90 px-5 py-6 shadow-sm sm:px-6">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">
              Tổng quan
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Số dư, hũ, danh mục và mục tiêu — đồng bộ từ máy chủ.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="cursor-pointer bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5]"
            >
              <Link to={ROUTES.TRANSACTIONS_ADD}>
                <Plus className="h-4 w-4" />
                Thêm giao dịch
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="cursor-pointer border-violet-200 bg-white/80 text-[#4F46E5] hover:bg-violet-50"
            >
              <Link to={ROUTES.JARS}>
                <PiggyBank className="h-4 w-4" />
                Hũ
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="cursor-pointer border-violet-200 bg-white/80 text-[#4F46E5] hover:bg-violet-50"
            >
              <Link to={ROUTES.GOALS}>
                <Goal className="h-4 w-4" />
                Mục tiêu
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="cursor-pointer border-violet-200 bg-white/80 text-[#4F46E5] hover:bg-violet-50"
            >
              <Link to={ROUTES.LIMITS}>
                <WalletCards className="h-4 w-4" />
                Giới hạn
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tổng quan số dư + thu chi */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-violet-200/70 bg-white shadow-none ring-1 ring-violet-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#0f172a]">Tổng số dư</CardTitle>
            <CardDescription className="text-violet-600/70">
              Tài khoản + hũ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-[#6366F1]">
              {formatCurrency(bs.totalBalance)}
            </p>
            <dl className="mt-3 space-y-1 text-sm text-slate-600">
              <div className="flex justify-between">
                <dt>Đã phân bổ (hũ)</dt>
                <dd className="font-medium text-violet-900/90">
                  {formatCurrency(bs.allocatedBalance)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Chưa phân bổ</dt>
                <dd className="font-medium text-violet-900/90">
                  {formatCurrency(bs.unallocatedBalance)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="border-violet-200/70 bg-white shadow-none ring-1 ring-violet-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#0f172a]">Thu / Chi</CardTitle>
            <CardDescription className="text-violet-600/70">
              Tổng hợp giao dịch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Thu</span>
              <span className="ml-auto font-medium">
                {formatCurrency(bs.totalIncome)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm">Chi</span>
              <span className="ml-auto font-medium">
                {formatCurrency(bs.totalExpense)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm font-medium">
              <span>Chênh lệch</span>
              <span
                className={
                  bs.netChange >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {bs.netChange >= 0 ? "+" : ""}
                {formatCurrency(bs.netChange)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-200/70 bg-white shadow-none ring-1 ring-violet-100 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#0f172a]">Lối tắt</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              variant="outline"
              asChild
              className="w-full justify-start border-violet-200 text-[#4F46E5] hover:bg-violet-50"
            >
              <Link to={ROUTES.TRANSACTIONS}>
                <ReceiptText className="h-4 w-4" />
                Xem tất cả giao dịch
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full justify-start border-violet-200 text-[#4F46E5] hover:bg-violet-50"
            >
              <Link to={ROUTES.TRANSACTIONS_ADD}>
                <Plus className="h-4 w-4" />
                Giao dịch mới (chọn tài khoản nguồn)
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Nguồn tiền */}
      <Card className="border-violet-200/70 bg-white shadow-none ring-1 ring-violet-100">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Nguồn tiền</CardTitle>
            <CardDescription>Tài khoản tài chính</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="shrink-0 text-[#6366F1] hover:bg-violet-50 hover:text-[#4F46E5]"
          >
            <Link to={ROUTES.ACCOUNTS}>Quản lý</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!hasAccounts ? (
            <div className="rounded-lg border border-dashed border-violet-200 bg-violet-50/50 p-6 text-center text-sm text-slate-600">
              <p>Chưa có tài khoản hiển thị.</p>
              <p className="mt-1">
                Sau onboarding thường có tài khoản Cash; nếu trống, kiểm tra API
                hoặc tạo giao dịch với tài khoản mới.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button
                  asChild
                  className="cursor-pointer bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                >
                  <Link to={ROUTES.ACCOUNTS}>Thêm nguồn tiền</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="cursor-pointer border-violet-200 text-[#4F46E5] hover:bg-violet-50"
                >
                  <Link to={ROUTES.TRANSACTIONS_ADD}>Giao dịch đầu tiên</Link>
                </Button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-violet-100 rounded-lg border border-violet-100">
              {data.financialAccounts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between bg-white px-4 py-3 text-sm"
                >
                  <span className="font-medium">
                    {a.name}
                    {a.isDefault ? (
                      <span className="ml-2 text-xs text-slate-400">
                        (mặc định)
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[#6366F1]">
                    {formatCurrency(a.currentBalance)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hũ */}
        <Card className="border-violet-200/70 bg-white shadow-none ring-1 ring-violet-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-[#0f172a]">Hũ</CardTitle>
              <CardDescription className="text-violet-600/70">
                Số dư & đã chi
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[#6366F1] hover:bg-violet-50 hover:text-[#4F46E5]"
            >
              <Link to={ROUTES.JARS}>Quản lý</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!hasJars ? (
              <div className="rounded-lg border border-dashed border-violet-200 bg-violet-50/40 p-6 text-center text-sm text-slate-600">
                <p>Chưa có hũ.</p>
                <Button
                  asChild
                  className="mt-4 cursor-pointer bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                >
                  <Link to={ROUTES.JARS}>Tạo hũ</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {data.jarSummary.map((j) => (
                  <li
                    key={j.jarId}
                    className="rounded-lg border border-slate-100 bg-white px-3 py-2.5"
                  >
                    <div className="flex justify-between text-sm font-medium">
                      <span>{j.jarName}</span>
                      <span>{formatCurrency(j.balance)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-slate-500">
                      <span>Đã chi: {formatCurrency(j.spent)}</span>
                      <span>
                        {Number.isFinite(j.spentPercentage)
                          ? `${j.spentPercentage.toFixed(0)}% chi`
                          : "—"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Chi theo danh mục */}
        <Card className="border-violet-200/70 bg-white shadow-none ring-1 ring-violet-100">
          <CardHeader>
            <CardTitle className="text-base text-[#0f172a]">
              Chi theo danh mục
            </CardTitle>
            <CardDescription className="text-violet-600/70">
              Tỷ lệ trên tổng chi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-slate-500">
                Chưa có dữ liệu chi theo danh mục.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.categoryBreakdown.map((c) => (
                  <li key={c.categoryId}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{c.categoryName}</span>
                      <span>{formatCurrency(c.totalAmount)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-violet-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, c.percentage))}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Giao dịch gần đây */}
        <Card className="border-violet-200/70 bg-white shadow-none ring-1 ring-violet-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-[#0f172a]">
              Giao dịch gần đây
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[#6366F1] hover:bg-violet-50 hover:text-[#4F46E5]"
            >
              <Link to={ROUTES.TRANSACTIONS}>Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!hasRecentTx ? (
              <div className="rounded-lg border border-dashed border-violet-200 bg-violet-50/40 p-6 text-center text-sm text-slate-600">
                <p>Chưa có giao dịch.</p>
                <Button
                  asChild
                  className="mt-4 cursor-pointer bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                >
                  <Link to={ROUTES.TRANSACTIONS_ADD}>
                    Thêm giao dịch đầu tiên
                  </Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-2">
                {data.recentTransactions.slice(0, 8).map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between rounded-md border border-violet-100 bg-white px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">{t.note || "—"}</p>
                      <p className="text-xs text-slate-500">
                        {t.date
                          ? new Date(t.date).toLocaleString("vi-VN")
                          : ""}
                      </p>
                    </div>
                    <p
                      className={
                        t.type === "Income"
                          ? "font-medium text-green-600"
                          : "text-red-600"
                      }
                    >
                      {t.type === "Income" ? "+" : "-"}
                      {formatCurrency(Math.abs(t.transactionsAmount))}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Mục tiêu */}
        <Card className="border-violet-200/70 bg-white shadow-none ring-1 ring-violet-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-[#0f172a]">Mục tiêu</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[#6366F1] hover:bg-violet-50 hover:text-[#4F46E5]"
            >
              <Link to={ROUTES.GOALS}>Quản lý</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.goalProgress.length === 0 ? (
              <div className="rounded-lg border border-dashed border-violet-200 bg-violet-50/40 p-6 text-center text-sm text-slate-600">
                <p>Chưa có mục tiêu.</p>
                <Button
                  asChild
                  className="mt-4 cursor-pointer bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                >
                  <Link to={ROUTES.GOALS}>Tạo mục tiêu</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {data.goalProgress.map((g) => (
                  <li key={g.goalId}>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                      <span>{g.title}</span>
                      <span className="text-slate-500">
                        {g.daysRemaining > 0
                          ? `Còn ~${Math.ceil(g.daysRemaining)} ngày`
                          : "Hết hạn"}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-violet-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#6366F1] to-violet-400"
                        style={{
                          width: `${Math.min(100, Math.max(0, g.progressPercentage))}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-violet-700/80">
                      {g.progressPercentage.toFixed(0)}% hoàn thành
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
