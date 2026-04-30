import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useBudgetLimits } from "../hooks/useBudget";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function BudgetPage() {
  const { data, isLoading, isError } = useBudgetLimits();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading budget limits...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Failed to load budget limits.</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Budget</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-base">{item.period} Limit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount: {formatCurrency(item.limitAmount)}</p>
              <p className="text-sm text-muted-foreground">Alert at: {item.alertAtPercentage}%</p>
              <p className="text-sm text-muted-foreground">Status: {item.isActive ? "Active" : "Inactive"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
