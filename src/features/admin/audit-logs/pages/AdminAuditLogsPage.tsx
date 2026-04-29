import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { mockData } from "@/lib/mockData";

export function AdminAuditLogsPage() {
  const logs = mockData.tables.audit_logs;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {logs.map((item) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="font-medium">{item.action_type}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Entity: {item.entity_type} - IP: {item.ip_address}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
