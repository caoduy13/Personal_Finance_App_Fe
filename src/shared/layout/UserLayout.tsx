import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  CircleUserRound,
  Goal,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  ReceiptText,
  WalletCards,
  X,
} from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { useAuth, useLogoutMutation } from "@/features/auth/hooks/useAuth";

const userNavItems = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Giao dịch", to: ROUTES.TRANSACTIONS, icon: ReceiptText },
  { label: "Ngân sách", to: ROUTES.BUDGET, icon: WalletCards },
  { label: "Mục tiêu", to: ROUTES.GOALS, icon: Goal },
  { label: "Hũ", to: ROUTES.JARS, icon: PiggyBank },
] as const;

const mobilePrimaryItems = [
  userNavItems[0],
  userNavItems[1],
  userNavItems[3],
  userNavItems[4],
  userNavItems[2],
  { label: "Thông báo", to: ROUTES.NOTIFICATIONS, icon: Bell },
] as const;
const mobileMoreItems = [
  userNavItems[3],
  { label: "Hồ sơ", to: ROUTES.PROFILE, icon: CircleUserRound },
] as const;

export function UserLayout() {
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 md:px-6">
          <div className="-ml-1 md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-9 cursor-pointer p-0"
              onClick={() => setOpenMobileDrawer(true)}
              aria-label="Mở menu điều hướng"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <p className="ml-2 text-sm font-semibold md:ml-0">
            Personal Finance App
          </p>

          <nav className="ml-8 hidden items-center gap-1 md:flex">
            {userNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-9 w-[120px] items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-black",
                    isActive && "bg-slate-100 text-black",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-[#6366F1]" : "text-slate-500",
                      )}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Link
              to={ROUTES.NOTIFICATIONS}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-[#6366F1]"
              aria-label="Thông báo"
            >
              <Bell className="h-5 w-5" />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setOpenProfileMenu(true)}
              onMouseLeave={() => setOpenProfileMenu(false)}
            >
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <CircleUserRound className="h-5 w-5 text-slate-600" />
                <span className="max-w-[140px] truncate">{user?.fullName ?? "Tài khoản"}</span>
              </button>

              <div
                className={cn(
                  "absolute right-0 top-full z-30 w-40 pt-2 transition-all duration-150",
                  openProfileMenu
                    ? "visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible -translate-y-1 opacity-0",
                )}
              >
                <div className="rounded-xl border bg-white p-1.5 shadow-lg">
                  <Link
                    to={ROUTES.PROFILE}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    onClick={() => setOpenProfileMenu(false)}
                  >
                    Hồ sơ
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                        disabled={isPending}
                      >
                        {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận đăng xuất?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng ứng dụng.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button variant="outline" className="w-full cursor-pointer sm:flex-1">
                            Ở lại
                          </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            className="w-full cursor-pointer bg-red-600 text-white hover:bg-red-700 sm:flex-1"
                            onClick={() => {
                              setOpenProfileMenu(false);
                              logout();
                            }}
                          >
                            Đăng xuất
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
        <Outlet />
      </main>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/35 transition-opacity md:hidden",
          openMobileDrawer ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpenMobileDrawer(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r bg-white p-4 transition-transform md:hidden",
          openMobileDrawer ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="-mt-1 mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Điều hướng</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-9 cursor-pointer p-0"
            onClick={() => setOpenMobileDrawer(false)}
            aria-label="Đóng menu điều hướng"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1">
          {mobileMoreItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-black",
                  isActive && "bg-slate-100 text-black",
                )
              }
              onClick={() => setOpenMobileDrawer(false)}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-[#6366F1]" : "text-slate-500",
                    )}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="mt-auto w-full cursor-pointer border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={isPending}
            >
              <LogOut className="h-4 w-4" />
              {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận đăng xuất?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng ứng dụng.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline" className="w-full cursor-pointer sm:flex-1">
                  Ở lại
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  className="w-full cursor-pointer bg-red-600 text-white hover:bg-red-700 sm:flex-1"
                  onClick={() => {
                    setOpenMobileDrawer(false);
                    logout();
                  }}
                >
                  Đăng xuất
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background md:hidden">
        <div className="mx-auto grid h-16 max-w-xl grid-cols-5 px-1">
          {mobilePrimaryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex cursor-pointer items-center justify-center px-1 py-1"
            >
              {({ isActive }) => (
                <span
                  className={cn(
                    "inline-flex w-full max-w-[72px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-500 transition",
                    isActive && "bg-slate-200 text-black",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-[#6366F1]" : "text-slate-500",
                    )}
                  />
                  <span className="max-w-full whitespace-nowrap text-[10px] leading-none">
                    {item.label}
                  </span>
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
