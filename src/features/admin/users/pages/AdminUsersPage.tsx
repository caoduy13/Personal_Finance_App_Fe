import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  useAdminUsers,
  useChangeUserRoleMutation,
} from "../hooks/useAdminUsers";
import { AccountRole } from "../types";

function roleCodeToAccountRole(code: string): AccountRole {
  const c = code.trim().toUpperCase();
  if (c === "ADMIN") return AccountRole.Admin;
  return AccountRole.User;
}

export function AdminUsersPage() {
  const { data, isLoading, isError } = useAdminUsers();
  const changeRole = useChangeUserRoleMutation();

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
          {data.map((item) => {
            const currentRole = roleCodeToAccountRole(item.roleCode);
            const rowBusy =
              changeRole.isPending &&
              changeRole.variables?.accountId === item.id;

            return (
              <div
                key={item.id}
                className="grid gap-2 rounded-md border p-3 text-sm md:grid-cols-5 md:items-center"
              >
                <p className="font-medium">{item.fullName}</p>
                <p className="text-muted-foreground">{item.email}</p>
                <p className="text-muted-foreground">{item.username}</p>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground md:sr-only">
                    Role
                  </Label>
                  <select
                    className="h-9 w-full max-w-40 rounded-md border border-input bg-background px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentRole}
                    disabled={rowBusy}
                    onChange={(e) => {
                      const next = Number(e.target.value) as AccountRole;
                      if (next === currentRole) return;
                      changeRole.mutate({
                        accountId: item.id,
                        role: next,
                      });
                    }}
                  >
                    <option value={AccountRole.User}>User</option>
                    <option value={AccountRole.Admin}>Admin</option>
                  </select>
                </div>
                <p
                  className={
                    item.status === "Active"
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {item.status}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
