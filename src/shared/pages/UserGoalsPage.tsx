import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useGoals } from "@/features/goals";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function UserGoalsPage() {
  const { data, isLoading, isError } = useGoals();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading goals...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Failed to load goals.</p>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-xl font-semibold">Mục tiêu</h1>
        <p className="mt-2 text-sm text-slate-600">Theo dõi tiến độ các mục tiêu tài chính.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có mục tiêu nào.</p>
        ) : (
          data.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="text-base">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Đã tiết kiệm: {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {goal.progressPercentage.toFixed(1)}% — Hạn: {goal.dueDate} — {goal.status}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
