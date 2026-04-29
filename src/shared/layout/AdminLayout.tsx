import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from "lucide-react";
import { useAuth, useLogoutMutation } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

const sidebarNavItems = [
  { label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "Users", to: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Notifications", to: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
  { label: "Audit Logs", to: ROUTES.ADMIN_AUDIT_LOGS, icon: ClipboardList },
] as const;

const bottomNavItems = [
  { label: "Users", to: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Notify", to: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
  { label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "Audit", to: ROUTES.ADMIN_AUDIT_LOGS, icon: ClipboardList },
  { label: "Logout", icon: LogOut, isLogout: true },
] as const;

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { role } = useAuth();
  const { mutate: logout, isPending } = useLogoutMutation();

  const sidebarWidthClass = collapsed ? "md:w-[78px]" : "md:w-[250px]";

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <div className="flex min-h-screen w-full">
        <aside
          className={cn(
            "hidden shrink-0 flex-col border-r bg-slate-50 p-3 transition-all duration-300 md:flex",
            sidebarWidthClass,
          )}
        >
          <div className="mb-4 h-14">
            <div
              className={cn(
                "min-w-0 transition-opacity duration-200",
                collapsed ? "pointer-events-none opacity-0" : "opacity-100",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Admin
              </p>
              <p className="truncate text-sm font-medium">{role ?? "admin"}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.ADMIN_DASHBOARD}
                className={({ isActive }) =>
                  cn(
                    "group flex h-12 cursor-pointer items-center gap-3 rounded-md border-r-2 border-transparent px-4 text-base text-slate-500 transition hover:bg-slate-100 hover:text-black",
                    isActive && "border-[#6366F1] bg-slate-200 font-semibold text-black",
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-[#6366F1]" : "text-slate-500 group-hover:text-[#6366F1]",
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span
                      className={cn(
                        "whitespace-nowrap leading-none",
                        collapsed && "hidden",
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-1">
            <div className="mb-2 -mx-3 border-t" />

            <Button
              variant="ghost"
              className={cn(
                "group h-12 w-full cursor-pointer justify-start gap-3 rounded-md px-4 text-base font-normal text-slate-500 transition hover:bg-slate-100 hover:text-black",
              )}
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-[#6366F1]" />
              ) : (
                <PanelLeftClose className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-[#6366F1]" />
              )}
              <span
                className={cn(
                  "whitespace-nowrap leading-none",
                  collapsed && "hidden",
                )}
              >
                {collapsed ? "Expand" : "Collapse"}
              </span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "h-12 w-full cursor-pointer justify-start gap-3 rounded-md px-4 text-base font-normal text-red-600 transition hover:bg-red-50 hover:text-red-700",
              )}
              onClick={() => logout()}
              disabled={isPending}
            >
              <LogOut className="h-5 w-5 shrink-0 text-red-600" />
              <span
                className={cn(
                  "whitespace-nowrap leading-none",
                  collapsed && "hidden",
                )}
              >
                {isPending ? "Logging out..." : "Logout"}
              </span>
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background md:hidden">
        <div className="mx-auto grid h-18 max-w-xl grid-cols-5 px-1">
          {bottomNavItems.map((item) =>
            "to" in item ? (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTES.ADMIN_DASHBOARD}
                className="group flex cursor-pointer items-center justify-center px-1 py-1"
              >
                {({ isActive }) => (
                  <span
                    className={cn(
                      "inline-flex w-full max-w-[68px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-500 transition",
                      isActive
                        ? "bg-slate-200 font-semibold text-black shadow-sm"
                        : "group-hover:text-black",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-6 w-6",
                        isActive ? "text-[#6366F1]" : "text-slate-500 group-hover:text-[#6366F1]",
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span>{item.label}</span>
                  </span>
                )}
              </NavLink>
            ) : (
              <button
                key="admin-bottom-logout"
                type="button"
                className="inline-flex w-full max-w-[68px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                onClick={() => logout()}
                disabled={isPending}
              >
                <item.icon className="h-6 w-6 text-red-600" />
                <span>{isPending ? "..." : item.label}</span>
              </button>
            ),
          )}
        </div>
      </nav>
    </div>
  );
}
