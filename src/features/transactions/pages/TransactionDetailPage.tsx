import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants/routes";
import { useTransaction } from "../hooks/useTransactions";
import type { TransactionType } from "../types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

function typeLabel(type: TransactionType) {
  if (type === "Income") return "Thu nhập";
  if (type === "Expense") return "Chi tiêu";
  return "Chuyển tiền";
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="grid gap-1 border-b border-violet-100 py-3 last:border-0 sm:grid-cols-[150px_1fr]">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-800">{value || "—"}</dd>
    </div>
  );
}

export function TransactionDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useTransaction(id);

  if (isLoading) {
    return <p className="text-sm text-violet-600/80">Đang tải giao dịch...</p>;
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-5">
        <p className="text-sm text-red-600">
          Không tải được chi tiết giao dịch.
        </p>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" className="cursor-pointer px-0">
        <Link to={ROUTES.TRANSACTIONS}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>
      </Button>

      <Card className="border-violet-200/80 bg-white/90 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-[#0f172a]">
            Chi tiết giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl>
            <DetailRow label="Loại" value={typeLabel(data.type)} />
            <DetailRow
              label="Số tiền"
              value={formatCurrency(Math.abs(data.amount))}
            />
            <DetailRow
              label="Ngày"
              value={new Date(data.transactionDate).toLocaleString("vi-VN")}
            />
            <DetailRow label="Danh mục" value={data.categoryName} />
            <DetailRow label="Hũ" value={data.jarName} />
            <DetailRow label="Tài khoản" value={data.financialAccountName} />
            <DetailRow label="Ghi chú" value={data.note} />
          </dl>
        </CardContent>
      </Card>
    </section>
  );
}
