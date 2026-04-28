import { GoalProgressList } from "../components/GoalProgressList";
import { RecentTransactions } from "../components/RecentTransactions";
import { StatCard } from "../components/StatCard";
import { useDashboardSummary } from "../hooks/useDashboard";

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading dashboard...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-500">Failed to load dashboard data.</p>;
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">User Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your personal finance activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {data.stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentTransactions items={data.recentTransactions} />
        <GoalProgressList goals={data.goals} />
      </div>
    </section>
  );
}
