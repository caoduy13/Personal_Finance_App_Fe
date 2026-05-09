import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAdminBroadcasts } from "@/features/admin/broadcasts";

export function AdminBroadcastsPage() {
  const { data, isLoading, isError } = useAdminBroadcasts({
    pageIndex: 1,
    pageSize: 20,
    status: "Sent",
  });

  if (isLoading)
    return (
      <p className="text-sm text-muted-foreground">Loading broadcasts...</p>
    );
  if (isError || !data)
    return <p className="text-sm text-red-500">Failed to load broadcasts.</p>;

  const broadcasts = data.items;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Broadcast History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {broadcasts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No broadcasts yet.</p>
          ) : (
            broadcasts.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Status: {item.status} — Delivered: {item.deliveredCount}/
                  {item.targetCount}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
