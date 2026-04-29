import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { mockData } from "@/lib/mockData";

export function AdminNotificationsPage() {
  const broadcasts = mockData.tables.broadcasts;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Broadcast History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {broadcasts.map((item) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Status: {item.status} - Delivered: {item.delivered_count}/{item.target_count}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
