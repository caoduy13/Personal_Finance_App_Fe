import { NavLink, Outlet } from "react-router-dom";
import { Topbar } from "@/shared/components/common/Topbar";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Overview", to: ROUTES.ADMIN_DASHBOARD },
  { label: "User Dashboard", to: ROUTES.DASHBOARD },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Topbar />
      <div className="mx-auto grid w-full max-w-6xl gap-4 p-4 md:grid-cols-[220px_1fr] md:p-6">
        <aside className="rounded-lg border bg-background p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Admin</p>
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-3 py-2 text-sm transition hover:bg-muted",
                    isActive && "bg-muted font-medium",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
