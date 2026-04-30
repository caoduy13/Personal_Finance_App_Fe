import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { DashboardTransaction } from "../types";

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function RecentTransactions({ items }: { items: DashboardTransaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? <p className="text-sm text-muted-foreground">No transactions yet.</p> : null}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">{item.note || "Untitled transaction"}</p>
              <p className="text-xs text-muted-foreground">{new Date(item.transactionDate).toLocaleString("vi-VN")}</p>
            </div>
            <p className={item.type === "Income" ? "text-green-600" : "text-red-500"}>
              {item.type === "Income" ? "+" : "-"}
              {formatAmount(item.amount)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
