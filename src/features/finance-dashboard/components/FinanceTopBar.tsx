import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  MessageCircle,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  CreditCard,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  chatMessages as initialChat,
  mockUser,
  notifications as initialNotifications,
} from "../mockData";
import { useFinanceDashboard } from "../context/FinanceDashboardContext";
import type { ChatMessage, NotificationItem, ProfileSection } from "../types";
import { CalendarPopover } from "./CalendarPopover";
import { UserAvatar } from "./UserAvatar";

function IconCircleButton({
  children,
  badge,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  badge?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
      {children}
      {badge ? (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      ) : null}
    </button>
  );
}

type FinanceTopBarProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenProfile: (section?: ProfileSection) => void;
  onSignOut: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

export function FinanceTopBar({
  isDark,
  onToggleTheme,
  onOpenProfile,
  onSignOut,
  searchQuery,
  onSearchChange,
}: FinanceTopBarProps) {
  const { tr, avatarImageUrl, language } = useFinanceDashboard();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    initialNotifications.map((n) => ({
      id: n.id,
      titleKey: n.titleKey,
      bodyKey: n.bodyKey,
      time: n.time,
      unread: n.unread,
    })),
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    initialChat.map((m) => ({
      id: m.id,
      from: m.from,
      text: "",
      textKey: m.textKey,
      time: m.time,
    })),
  );
  const [chatInput, setChatInput] = useState("");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const profileMenuItems = [
    {
      label: tr("viewProfile"),
      icon: User,
      action: () => onOpenProfile("profile"),
    },
    {
      label: tr("settings"),
      icon: Settings,
      action: () => onOpenProfile("settings"),
    },
    {
      label: tr("billing"),
      icon: CreditCard,
      action: () => onOpenProfile("billing"),
    },
    {
      label: tr("signOut"),
      icon: LogOut,
      action: onSignOut,
      danger: true,
    },
  ] as const;

  const markAllRead = () => {
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));
  };

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((msgs) => [
      ...msgs,
      {
        id: `c-${Date.now()}`,
        from: "user" as const,
        text,
        time: new Date().toLocaleTimeString(
          language === "vi" ? "vi-VN" : "en-US",
          { hour: "numeric", minute: "2-digit" },
        ),
      },
    ]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        {
          id: `c-reply-${Date.now()}`,
          from: "support" as const,
          text: "",
          textKey: "chatReply",
          time: new Date().toLocaleTimeString(
            language === "vi" ? "vi-VN" : "en-US",
            { hour: "numeric", minute: "2-digit" },
          ),
        },
      ]);
    }, 800);
  };

  return (
    <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold tracking-tight">{tr("template")}</h1>

        <div className="relative mx-auto hidden min-w-[200px] flex-1 sm:block sm:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder={tr("search")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-500 dark:focus:ring-neutral-800"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label={isDark ? tr("lightMode") : tr("darkMode")}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <CalendarPopover />

          <Popover>
            <PopoverTrigger asChild>
              <span>
                <IconCircleButton
                  badge={unreadCount > 0}
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </IconCircleButton>
              </span>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 p-0 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                <p className="font-semibold">{tr("notifications")}</p>
                {unreadCount > 0 ? (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-medium text-neutral-600 underline dark:text-neutral-400"
                  >
                    {tr("markAllRead")}
                  </button>
                ) : null}
              </div>
              <ul className="max-h-64 overflow-y-auto p-2">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications((list) =>
                          list.map((item) =>
                            item.id === n.id ? { ...item, unread: false } : item,
                          ),
                        )
                      }
                      className={cn(
                        "w-full rounded-lg px-3 py-2.5 text-left text-sm",
                        n.unread
                          ? "bg-neutral-50 dark:bg-neutral-800/80"
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-800",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {n.unread ? (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        ) : (
                          <span className="mt-1.5 h-2 w-2 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{tr(n.titleKey)}</p>
                          <p className="text-xs text-neutral-500">{tr(n.bodyKey)}</p>
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <span>
                <IconCircleButton aria-label="Open chat">
                  <MessageCircle className="h-4 w-4" />
                </IconCircleButton>
              </span>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 p-0 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                <p className="font-semibold">{tr("supportChat")}</p>
                <p className="text-xs text-neutral-500">{tr("bookkeepingBrand")}</p>
              </div>
              <ul className="max-h-56 space-y-2 overflow-y-auto p-3">
                {chatMessages.map((m) => (
                  <li
                    key={m.id}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                      m.from === "user"
                        ? "ml-auto bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-neutral-100 dark:bg-neutral-800",
                    )}
                  >
                    <p>{m.textKey ? tr(m.textKey) : m.text}</p>
                    <p className="mt-0.5 text-[10px] opacity-60">{m.time}</p>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 border-t border-neutral-100 p-3 dark:border-neutral-800">
                <input
                  type="text"
                  placeholder={tr("typeMessage")}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  className="min-w-0 flex-1 rounded-full border border-neutral-200 px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950"
                />
                <button
                  type="button"
                  onClick={sendChat}
                  className="shrink-0 rounded-full bg-neutral-900 px-3 py-2 text-xs font-medium text-white dark:bg-white dark:text-neutral-900"
                >
                  {tr("send")}
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={profileOpen} onOpenChange={setProfileOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 rounded-full pl-0.5 pr-2 transition hover:opacity-90"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                <UserAvatar size="sm" imageUrl={avatarImageUrl} />
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-neutral-500 transition",
                    profileOpen && "rotate-180",
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-56 p-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="mb-2 flex items-center gap-3 border-b border-neutral-100 px-2 pb-3 dark:border-neutral-800">
                <UserAvatar size="md" imageUrl={avatarImageUrl} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{mockUser.name}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {mockUser.email}
                  </p>
                </div>
              </div>
              {profileMenuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    item.action();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    "danger" in item &&
                      item.danger &&
                      "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
                  )}
                >
                  <item.icon className="h-4 w-4 opacity-70" />
                  {item.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="relative px-4 pb-4 sm:hidden">
        <Search className="pointer-events-none absolute left-8 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          placeholder={tr("search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
    </header>
  );
}
