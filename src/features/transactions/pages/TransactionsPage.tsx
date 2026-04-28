import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">{item.note || "Untitled"}</p>
                <p className="text-xs text-muted-foreground">{new Date(item.transactionDate).toLocaleString("vi-VN")}</p>
              </div>
              <p className={item.type === "Income" ? "text-green-600" : "text-red-500"}>
                {item.type === "Income" ? "+" : "-"}
                {formatCurrency(item.amount)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
