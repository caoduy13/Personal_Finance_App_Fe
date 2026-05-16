import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  useNotifications,
  useUpdateNotificationStatus,
  type NotificationItem,
} from "@/features/notifications";
import { ROUTES } from "@/shared/constants/routes";

const PAGE_SIZE = 10;

export function UserNotificationsPage() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [status, setStatus] = useState<"" | "read" | "unread">("");
  const [typeFilter, setTypeFilter] = useState("");

  const params = useMemo(
    () => ({
      pageSize: PAGE_SIZE,
      pageIndex,
      ...(status ? { status } : {}),
      ...(typeFilter.trim() ? { type: typeFilter.trim() } : {}),
    }),
    [pageIndex, status, typeFilter],
  );

  const { data, isLoading, isError, refetch } = useNotifications(params);
  const { mutateAsync: updateStatus, isPending: updating } =
    useUpdateNotificationStatus();

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalItems / data.pageSize))
    : 1;

  const markRead = async (item: NotificationItem) => {
    if (item.isRead) return;
    await updateStatus({ ids: [item.id], isRead: true, markAll: false });
  };

  const openRelatedTarget = (item: NotificationItem) => {
    const metadata = item.metadata ?? {};
    const transactionId = String(metadata.transactionId ?? "").trim();
    const limitId = String(metadata.limitId ?? "").trim();
    const goalId = String(metadata.goalId ?? "").trim();
    const jarId = String(metadata.jarId ?? "").trim();

    if (transactionId) {
      navigate(ROUTES.TRANSACTION_DETAIL_PATH(transactionId));
      return;
    }
    if (limitId || item.type === "SpendingAlert") {
      navigate(ROUTES.LIMITS);
      return;
    }
    if (goalId || item.type === "GoalUpdate") {
      navigate(ROUTES.GOALS);
      return;
    }
    if (jarId) {
      navigate(ROUTES.JARS);
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    await markRead(item);
    openRelatedTarget(item);
  };

  const markAllRead = async () => {
    await updateStatus({ isRead: true, markAll: true });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0f172a]">Thông báo</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tin nhắn hệ thống, cảnh báo và broadcast —{" "}
            <span className="font-medium text-[#6366F1]">
              {data?.unreadCount ?? "—"} chưa đọc
            </span>
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer border-[#d7def5] shrink-0"
          disabled={updating || (data?.unreadCount ?? 0) === 0}
          onClick={() => void markAllRead()}
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <Card className="border-[#d7def5] shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-[#0f172a]">
            <Bell className="h-4 w-4 text-[#6366F1]" />
            Hộp thư
          </CardTitle>
          <CardDescription>
            Lọc theo trạng thái đã đọc / chưa đọc hoặc theo loại thông báo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <label htmlFor="notif-status" className="text-xs text-slate-500">
                Trạng thái
              </label>
              <select
                id="notif-status"
                className="h-9 rounded-md border border-[#d7def5] bg-white px-3 text-sm"
                value={status}
                onChange={(e) => {
                  setPageIndex(1);
                  setStatus(e.target.value as typeof status);
                }}
              >
                <option value="">Tất cả</option>
                <option value="unread">Chưa đọc</option>
                <option value="read">Đã đọc</option>
              </select>
            </div>
            <div className="min-w-[160px] flex-1 space-y-1">
              <label htmlFor="notif-type" className="text-xs text-slate-500">
                Loại (type)
              </label>
              <input
                id="notif-type"
                className="h-9 w-full rounded-md border border-[#d7def5] px-3 text-sm"
                placeholder="VD: SpendingAlert, Broadcast…"
                value={typeFilter}
                onChange={(e) => {
                  setPageIndex(1);
                  setTypeFilter(e.target.value);
                }}
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-500">Đang tải thông báo...</p>
          ) : isError ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600">Không tải được thông báo.</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                Thử lại
              </Button>
            </div>
          ) : !data?.items.length ? (
            <div className="rounded-lg border border-dashed border-[#d7def5] bg-slate-50/60 py-10 text-center text-sm text-slate-600">
              <Bell className="mx-auto mb-2 h-9 w-9 text-[#6366F1]/35" />
              Không có thông báo phù hợp.
            </div>
          ) : (
            <ul className="divide-y divide-[#e8ecf8] rounded-lg border border-[#d7def5]">
              {data.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`flex w-full cursor-pointer gap-3 px-4 py-3 text-left transition hover:bg-violet-50/60 ${
                      item.isRead ? "bg-white" : "bg-[#6366F1]/[0.06]"
                    }`}
                    onClick={() => void handleNotificationClick(item)}
                  >
                    {!item.isRead ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6366F1]" />
                    ) : (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-transparent" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#0f172a]">{item.title}</p>
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          {item.type}
                        </Badge>
                        {!item.isRead ? (
                          <Badge variant="default" className="bg-[#6366F1] text-[10px]">
                            Mới
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                        {item.body}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(item.occurredAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {data && data.totalItems > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e8ecf8] pt-4">
              <p className="text-xs text-slate-500">
                Trang {data.pageIndex}/{totalPages} · {data.totalItems} mục
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={pageIndex <= 1}
                  onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={pageIndex >= totalPages}
                  onClick={() =>
                    setPageIndex((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
