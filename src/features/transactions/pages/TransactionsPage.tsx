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

export function TransactionsPage() {
  const { data, isLoading, isError } = useTransactions();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading transactions...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Failed to load transactions.</p>;

  const rows = data.items;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Giao dịch</h1>
        <Button asChild className="w-full cursor-pointer sm:w-auto">
          <Link to={ROUTES.TRANSACTIONS_ADD}>
            <Plus className="h-4 w-4" />
            Thêm giao dịch
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">{item.note || "Untitled"}</p>
                <p className="text-xs text-muted-foreground">{new Date(item.transactionDate).toLocaleString("vi-VN")}</p>
              </div>
              <p className={item.type === "Income" ? "text-green-600" : "text-red-500"}>
                {item.type === "Income" ? "+" : "-"}
                {formatCurrency(Math.abs(item.amount))}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
