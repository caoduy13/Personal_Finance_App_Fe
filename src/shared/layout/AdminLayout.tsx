import { NavLink, Outlet } from "react-router-dom";
import { Topbar } from "@/shared/components/common/Topbar";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/lib/utils";

const adminNav = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }],
  },
  {
    section: "Management",
    items: [{ label: "Users", to: ROUTES.ADMIN_USERS }],
  },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Topbar />
      <div className="mx-auto grid w-full max-w-6xl gap-4 p-4 md:grid-cols-[220px_1fr] md:p-6">
        <aside className="rounded-lg border bg-background p-3">
          <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            Admin Portal
          </p>
          <nav className="space-y-4">
            {adminNav.map((group) => (
              <div key={group.section}>
                <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.section}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "block rounded-md px-3 py-2 text-sm transition hover:bg-muted",
                          isActive &&
                            "bg-primary text-primary-foreground hover:bg-primary/90",
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
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
