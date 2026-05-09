import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { useTransactions } from "../hooks/useTransactions";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

function amountClass(type: string) {
  if (type === "Income") return "text-green-600";
  if (type === "Transfer") return "text-slate-700";
  return "text-red-600";
}

function amountPrefix(type: string) {
  if (type === "Income") return "+";
  if (type === "Transfer") return "↔ ";
  return "-";
}

export function TransactionsPage() {
  const { data, isLoading, isError, refetch } = useTransactions();

  if (isLoading) {
    return (
      <p className="text-sm text-violet-600/80">Đang tải giao dịch...</p>
    );
  }
  if (isError || !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-5">
        <p className="text-sm text-red-600">Không tải được danh sách giao dịch.</p>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer border-violet-200 bg-white hover:bg-violet-50"
          onClick={() => void refetch()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  const rows = data.items;

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-violet-200/80 bg-linear-to-br from-violet-50 via-white to-indigo-50/90 px-5 py-6 shadow-sm sm:px-6">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">
              Thu · Chi · Chuyển
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">Giao dịch</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Thu, chi và chuyển khoản — đồng bộ từ máy chủ.
            </p>
          </div>
          <Button
            asChild
            className="w-full cursor-pointer bg-[#6366F1] text-white shadow-md shadow-violet-500/25 hover:bg-[#4F46E5] sm:w-auto"
          >
            <Link to={ROUTES.TRANSACTIONS_ADD}>
              <Plus className="h-4 w-4" />
              Thêm giao dịch
            </Link>
          </Button>
        </div>
      </div>
      <Card className="border-violet-200/80 bg-white/80 shadow-none backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0f172a]">
            Giao dịch gần đây
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.length === 0 ? (
            <p className="text-sm text-slate-600">
              Chưa có giao dịch. Thêm giao dịch thủ công hoặc đồng bộ từ ngân hàng
              liên kết.
            </p>
          ) : (
            rows.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-violet-200/80 bg-white/90 p-3 transition hover:border-violet-300 hover:shadow-sm hover:shadow-violet-500/10"
              >
                <div>
                  <p className="text-sm font-medium">
                    {item.note?.trim()
                      ? item.note
                      : item.categoryName ||
                        item.financialAccountName ||
                        item.jarName ||
                        item.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.transactionDate).toLocaleString("vi-VN")}
                    {item.type ? ` · ${item.type}` : ""}
                  </p>
                </div>
                <p className={`font-medium tabular-nums ${amountClass(item.type)}`}>
                  {amountPrefix(item.type)}
                  {formatCurrency(Math.abs(item.amount))}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
