import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useAdminUsers } from "../hooks/useAdminUsers";

export function AdminUsersPage() {
  const { data, isLoading, isError } = useAdminUsers();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading users...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Failed to load users.</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.map((item) => (
            <div key={item.id} className="grid gap-2 rounded-md border p-3 text-sm md:grid-cols-5">
              <p className="font-medium">{item.fullName}</p>
              <p className="text-muted-foreground">{item.email}</p>
              <p className="text-muted-foreground">{item.username}</p>
              <p className="text-muted-foreground">{item.roleCode}</p>
              <p className={item.status === "Active" ? "text-green-600" : "text-red-500"}>{item.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
