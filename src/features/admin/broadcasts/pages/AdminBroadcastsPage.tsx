import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { useAdminBroadcasts } from "@/features/admin/broadcasts";
import { CreateBroadcastForm } from "../components/CreateBroadcastForm";

const STATUS_OPTIONS = [
  { value: "Sent", label: "Đã gửi" },
  { value: "Queued", label: "Đang chờ / đã lên lịch" },
  { value: "Failed", label: "Thất bại" },
  { value: "Cancelled", label: "Đã hủy" },
] as const;

export function AdminBroadcastsPage() {
  const [listStatus, setListStatus] =
    useState<(typeof STATUS_OPTIONS)[number]["value"]>("Sent");

  const { data, isLoading, isError } = useAdminBroadcasts({
    pageIndex: 1,
    pageSize: 20,
    status: listStatus,
  });

  if (isLoading)
    return (
      <p className="text-sm text-muted-foreground">Loading broadcasts...</p>
    );
  if (isError || !data)
    return <p className="text-sm text-red-500">Failed to load broadcasts.</p>;

  const broadcasts = data.items;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tạo broadcast</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateBroadcastForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Lịch sử broadcast</CardTitle>
          <div className="flex flex-col gap-1.5 sm:w-64">
            <Label htmlFor="broadcast-list-status" className="text-xs">
              Trạng thái
            </Label>
            <select
              id="broadcast-list-status"
              className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={listStatus}
              onChange={(e) =>
                setListStatus(
                  e.target.value as (typeof STATUS_OPTIONS)[number]["value"],
                )
              }
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {broadcasts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No broadcasts yet.</p>
          ) : (
            broadcasts.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Status: {item.status} — Delivered: {item.deliveredCount}/
                  {item.targetCount}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
