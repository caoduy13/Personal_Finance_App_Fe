import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTransactions } from "../hooks/useTransactions";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

export function TransactionsPage() {
  const { data, isLoading, isError } = useTransactions();

  if (isLoading) {
    return (
      <p className="text-sm font-medium text-slate-500">Đang tải giao dịch…</p>
    );
  }
  if (isError || !data) {
    return (
      <p className="text-sm font-medium text-rose-600">
        Không tải được danh sách giao dịch.
      </p>
    );
  }

  return (
    <section className="rounded-[1.5rem] bg-slate-50/50 p-5 ring-1 ring-slate-100/80 md:p-7">
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)]">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-slate-500">Ghi chú</TableHead>
              <TableHead className="text-slate-500">Loại</TableHead>
              <TableHead className="text-slate-500">Thời gian</TableHead>
              <TableHead className="text-right text-slate-500">Số tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-slate-50">
                <TableCell className="font-semibold text-slate-800">
                  <span className="inline-flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                      {(item.note || "·").charAt(0)}
                    </span>
                    {item.note || "Không có mô tả"}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">
                  {item.type === "Income" ? "Thu nhập" : "Chi tiêu"}
                </TableCell>
                <TableCell className="text-slate-500">
                  {new Date(item.transactionDate).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right text-base font-bold",
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
    </section>
  );
}
