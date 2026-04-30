import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { DashboardGoal } from "../types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export function GoalProgressList({ goals }: { goals: DashboardGoal[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.length === 0 ? <p className="text-sm text-muted-foreground">No active goals.</p> : null}
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-1 rounded-md border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{goal.title}</p>
              <p className="text-xs text-muted-foreground">{goal.progressPercent}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary" style={{ width: `${goal.progressPercent}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
