import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Cloud,
  Goal,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PiggyBank,
  ReceiptText,
  Settings,
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
import { getUserPageMeta } from "@/shared/layout/userPageMeta";

const userNavItems = [
  { label: "Tổng quan", to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Giao dịch", to: ROUTES.TRANSACTIONS, icon: ReceiptText },
  { label: "Hũ tiền", to: ROUTES.JARS, icon: PiggyBank },
  { label: "Ngân sách", to: ROUTES.BUDGET, icon: WalletCards },
  { label: "Mục tiêu", to: ROUTES.GOALS, icon: Goal },
  { label: "Cài đặt", to: ROUTES.PROFILE, icon: Settings },
] as const;

export function UserLayout() {
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogoutMutation();
  const meta = getUserPageMeta(location.pathname);

  const isActivePath = (to: string) =>
    location.pathname === to ||
    (to !== ROUTES.DASHBOARD && location.pathname.startsWith(`${to}/`));

  const sidebarNav = (
    <nav className="flex flex-1 flex-col gap-1 pt-2">
      {userNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={() =>
            cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
              isActivePath(item.to)
                ? "bg-[#E8EFFF] text-[#3B5BDB] shadow-sm shadow-blue-500/10"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
            )
          }
          onClick={() => setOpenMobileDrawer(false)}
        >
          <item.icon
            className={cn(
              "size-[22px] shrink-0",
              isActivePath(item.to) ? "text-[#4A6CF5]" : "text-slate-400",
            )}
          />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F3F5F9] pb-20 md:pb-8">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-4 p-3 md:gap-6 md:p-6 lg:p-8">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col rounded-[1.75rem] bg-white px-4 py-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-100/80 lg:flex">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2 px-2 text-slate-800"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5B7CFF] to-[#3B5BDB] text-white shadow-md shadow-blue-500/30">
              <Cloud className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight lowercase">
              finjar
            </span>
          </Link>
          {sidebarNav}
          <div className="mt-auto rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 ring-1 ring-slate-100">
            <p className="text-xs font-semibold text-slate-700">Nâng cấp bản Pro</p>
            <p className="mt-1 text-[11px] leading-snug text-slate-500">
              Báo cáo nâng cao và đồng bộ không giới hạn.
            </p>
            <Button
              type="button"
              className="mt-3 w-full rounded-xl bg-[#FCD34D] font-semibold text-slate-900 shadow-sm hover:bg-[#FBBF24]"
            >
              Khám phá <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 pt-14 lg:pt-0">
          <div className="min-h-[calc(100vh-1.5rem)] rounded-[1.75rem] bg-white px-4 py-5 shadow-[0_12px_48px_-14px_rgba(15,23,42,0.15)] ring-1 ring-slate-100/90 md:px-8 md:py-7">
            <header className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem]">
                  {meta.title}
                </h1>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                  {meta.subtitle}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-100 transition hover:bg-slate-100"
                  aria-label="Tin nhắn"
                >
                  <Mail className="size-[18px]" />
                </button>
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  className="relative flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-100 transition hover:bg-slate-100"
                  aria-label="Thông báo"
                >
                  <Bell className="size-[18px]" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </Link>
                <div className="ml-1 flex items-center gap-2 rounded-full bg-slate-50 py-1 pl-1 pr-3 ring-1 ring-slate-100">
                  <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#5B7CFF] to-[#3B5BDB] text-sm font-bold text-white">
                    {(user?.fullName ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="max-w-[120px] truncate text-sm font-semibold text-slate-800">
                      {user?.fullName ?? "Tài khoản"}
                    </p>
                    <p className="text-[11px] font-medium capitalize text-slate-500">
                      {user?.role === "admin" ? "Admin" : "Người dùng"}
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      aria-label="Đăng xuất"
                    >
                      <LogOut className="size-[18px]" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Đăng xuất?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng ứng dụng.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="outline">Ở lại</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => logout()}
                        >
                          Đăng xuất
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </header>

            <Outlet />
          </div>
        </div>
      </div>

      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={() => setOpenMobileDrawer(true)}
          aria-label="Mở menu"
        >
          <Menu className="size-5" />
        </Button>
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 font-bold lowercase text-slate-800">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B7CFF] to-[#3B5BDB] text-white">
            <Cloud className="size-4" />
          </span>
          finjar
        </Link>
        <div className="w-10" />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden",
          openMobileDrawer ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpenMobileDrawer(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex w-[min(88vw,300px)] flex-col rounded-r-3xl bg-white p-5 shadow-2xl transition-transform lg:hidden",
          openMobileDrawer ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">Menu</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => setOpenMobileDrawer(false)}
            aria-label="Đóng"
          >
            <X className="size-5" />
          </Button>
        </div>
        {sidebarNav}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="mt-auto rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              disabled={isPending}
            >
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Đăng xuất?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn sẽ cần đăng nhập lại.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">Ở lại</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  className="bg-red-600 hover:bg-red-700"
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

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-5 gap-0 px-1">
          {[
            userNavItems[0],
            userNavItems[1],
            userNavItems[2],
            userNavItems[4],
            userNavItems[5],
          ].map((item) => {
            const active = isActivePath(item.to);
            return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex cursor-pointer flex-col items-center justify-center gap-0.5 py-2"
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-2xl transition-colors",
                  active ? "bg-[#E8EFFF] text-[#3B5BDB]" : "text-slate-400",
                )}
              >
                <item.icon className="size-5" />
              </span>
              <span
                className={cn(
                  "max-w-[72px] truncate text-center text-[10px] font-semibold leading-tight",
                  active ? "text-[#3B5BDB]" : "text-slate-500",
                )}
              >
                {item.label}
              </span>
            </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
