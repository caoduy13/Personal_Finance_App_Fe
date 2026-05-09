import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useAdminAuditLogs } from "../hooks/useAdminAuditLogs";

export function AdminAuditLogsPage() {
  const { data, isLoading, isError } = useAdminAuditLogs({ page: 1, pageSize: 50 });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading audit logs...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Failed to load audit logs.</p>;

  const logs = data.items;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit entries.</p>
          ) : (
            logs.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="font-medium">{item.actionType}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Admin: {item.adminUsername} — Entity: {item.entityType} —{" "}
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
