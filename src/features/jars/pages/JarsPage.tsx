import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useJars } from "../hooks/useJars";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function JarsPage() {
  const { data, isLoading, isError } = useJars();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading jars...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Failed to load jars.</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Jars</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((jar) => (
          <Card key={jar.id}>
            <CardHeader>
              <CardTitle className="text-base">{jar.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-muted-foreground">Balance: {formatCurrency(jar.balance)}</p>
              <p className="text-sm text-muted-foreground">Allocation: {jar.percentage ?? 0}%</p>
              <p className="text-sm text-muted-foreground">Status: {jar.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
