import { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  CalendarClock,
  CircleUserRound,
  Goal,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  ReceiptText,
  ScanLine,
  Tags,
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
import { useNotificationUnreadCount } from "@/features/notifications";
import { AiChatFab } from "@/features/ai-chat";

const userNavItems = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Giao dịch", to: ROUTES.TRANSACTIONS, icon: ReceiptText },
  { label: "Nguồn tiền", to: ROUTES.ACCOUNTS, icon: Landmark },
  { label: "Danh mục", to: ROUTES.CATEGORIES, icon: Tags },
  { label: "Ngân sách", to: ROUTES.BUDGET, icon: WalletCards },
  { label: "Mục tiêu", to: ROUTES.GOALS, icon: Goal },
  { label: "Hũ", to: ROUTES.JARS, icon: PiggyBank },
] as const;

/** Chỉ hiện trên desktop — trùng với drawer mobile (Nhắc / OCR / AI). */
const userNavDesktopExtras = [
  { label: "Nhắc lịch", to: ROUTES.REMINDERS, icon: CalendarClock },
  { label: "OCR hóa đơn", to: ROUTES.IMPORTS_OCR, icon: ScanLine },
] as const;

/** Thanh dưới: 5 mục + thông báo; Danh mục / Ngân sách / nhắc lịch / OCR / AI trong drawer. */
const mobilePrimaryItems = [
  userNavItems[0],
  userNavItems[1],
  userNavItems[2],
  userNavItems[5],
  userNavItems[6],
  { label: "Thông báo", to: ROUTES.NOTIFICATIONS, icon: Bell },
] as const;
const mobileMoreItems = [
  userNavItems[3],
  userNavItems[4],
  { label: "Nhắc lịch", to: ROUTES.REMINDERS, icon: CalendarClock },
  { label: "OCR hóa đơn", to: ROUTES.IMPORTS_OCR, icon: ScanLine },
  { label: "Hồ sơ", to: ROUTES.PROFILE, icon: CircleUserRound },
] as const;

const desktopSidebarItems = [
  ...userNavItems,
  ...userNavDesktopExtras,
] as const;

export function UserLayout() {
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { mutate: logout, isPending } = useLogoutMutation();
  const { data: unreadBadge } = useNotificationUnreadCount();
  const unreadCount = unreadBadge ?? 0;
  const isProfileRoute = location.pathname === ROUTES.PROFILE;

  /* Chỉ user thường (không phải admin) bị bắt làm onboarding khi BE báo chưa xong. */
  if (
    user &&
    !isAdmin &&
    user.isOnboardingCompleted === false &&
    location.pathname !== ROUTES.ONBOARDING
  ) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  const profileMenu = (
    <div
      className="relative"
      onMouseEnter={() => setOpenProfileMenu(true)}
      onMouseLeave={() => setOpenProfileMenu(false)}
    >
      <button
        type="button"
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100",
          isProfileRoute && "bg-slate-100 text-black",
        )}
      >
        <CircleUserRound
          className={cn(
            "h-5 w-5 text-slate-600",
            isProfileRoute && "text-[#6366F1]",
          )}
        />
        <span className="max-w-[140px] truncate">
          {[user?.firstName, user?.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() ||
            user?.username ||
            user?.email ||
            "Tài khoản"}
        </span>
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
          <NavLink
            to={ROUTES.PROFILE}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100",
                isActive && "bg-slate-100 text-black",
              )
            }
            onClick={() => setOpenProfileMenu(false)}
          >
            Hồ sơ
          </NavLink>
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
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer sm:flex-1"
                  >
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
  );

  const notiLink = (
    <Link
      to={ROUTES.NOTIFICATIONS}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-[#6366F1]"
      aria-label="Thông báo"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#6366F1] px-1 text-[10px] font-semibold leading-none text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 pb-20 md:pb-0">
      <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-background">
        <div className="flex h-14 w-full items-center gap-2 px-4 md:px-6">
          <div className="-ml-1 shrink-0 md:hidden">
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

          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0f172a] md:flex-none">
            Personal Finance App
          </p>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:ml-auto">
            {notiLink}
            <NavLink
              to={ROUTES.PROFILE}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-[#6366F1] md:hidden",
                isProfileRoute && "text-[#6366F1]",
              )}
              aria-label="Hồ sơ"
            >
              <CircleUserRound className="h-5 w-5" />
            </NavLink>
            <div className="hidden md:block">{profileMenu}</div>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-background md:sticky md:top-14 md:flex md:h-[calc(100dvh-3.5rem)] md:self-start">
          <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-3">
            {desktopSidebarItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-violet-100/90 text-[#6366F1] shadow-sm shadow-violet-500/10"
                      : "text-slate-600 hover:bg-slate-100 hover:text-black",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-[#6366F1]" : "text-slate-500",
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="mx-auto min-w-0 w-full max-w-7xl flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

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
                <Button
                  variant="outline"
                  className="w-full cursor-pointer sm:flex-1"
                >
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

      <AiChatFab />

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background md:hidden">
        <div className="mx-auto grid h-16 max-w-xl grid-cols-6 px-0.5">
          {mobilePrimaryItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex cursor-pointer items-center justify-center px-1 py-1"
            >
              {({ isActive }) => (
                <span
                  className={cn(
                    "relative inline-flex w-full max-w-[72px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-500 transition",
                    isActive && "bg-slate-200 text-black",
                  )}
                >
                  <span className="relative">
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-[#6366F1]" : "text-slate-500",
                      )}
                    />
                    {item.to === ROUTES.NOTIFICATIONS && unreadCount > 0 ? (
                      <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6366F1] px-0.5 text-[9px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    ) : null}
                  </span>
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
